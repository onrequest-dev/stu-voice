import { decodeJWT } from "@/lib/decodejwt";
import { rateLimiterMiddleware } from "@/lib/rateLimiterMiddleware";
import { supabase } from "@/lib/supabase";
import { you_need_account_to_post } from "@/static/keywords";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const voteSchema = z.object({
  id: z.number(),  // لأن الأمثلة id أرقام
  type: z.string().max(100)
});

const bodySchema = z.object({
  votes: z.array(voteSchema)
});

export async function POST(request: NextRequest) {
  // تحقق تحديد معدل الطلبات (rate limiting)
  const rateLimitResponse = await rateLimiterMiddleware(request);
  if (rateLimitResponse) return rateLimitResponse;

  // تحقق وجود JWT في الكوكيز
  const jwt = request.cookies.get("jwt")?.value;
  if (!jwt)
    return NextResponse.json(
      { error: you_need_account_to_post },
      { status: 401 }
    );

  // فك تشفير JWT والتحقق من صحته
  const jwt_user = decodeJWT(jwt) as JwtPayload | null;
  if (!jwt_user || typeof jwt_user === "string" || !jwt_user.user_name) {
    return NextResponse.json(
      { error: you_need_account_to_post },
      { status: 401 }
    );
  }

  // قراءة جسم الطلب JSON والتحقق من صحته
  const body = await request.json();
  const result = bodySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  // فصل الأصوات بحسب نوع التفاعل
  const upvoteDownvoteVotes = result.data.votes.filter(
    (reaction) => reaction.type === "upvote" || reaction.type === "downvote"
  );

  const pollVotes = result.data.votes.filter(
    (reaction) => reaction.type !== "upvote" && reaction.type !== "downvote"
  );

  // إدخال أو تحديث بيانات upvote/downvote
  if (upvoteDownvoteVotes.length > 0) {
    const upsertData = upvoteDownvoteVotes.map((reaction) => ({
      post_id: reaction.id,
      reaction_type: reaction.type,
      reactor_username: jwt_user.user_name,
    }));

    const { error } = await supabase
      .from("upvote_downvote_reactions")
      .upsert(upsertData, { onConflict: "post_id,reactor_username" });

    if (error) {
      console.log("Error upserting upvote/downvote:", error);
      return NextResponse.json(
        { error: "Failed to save upvote/downvote reactions" },
        { status: 500 }
      );
    }
  }

  // إدخال أو تحديث بيانات poll reactions
  if (pollVotes.length > 0) {
    const upsertData = pollVotes.map((reaction) => ({
      post_id: reaction.id,
      poll_option: reaction.type,  // استخدم نوع التفاعل كخيار التصويت في الاستطلاع
      reactor_username: jwt_user.user_name,
    }));

    const { error } = await supabase
      .from("poll_reactions")
      .upsert(upsertData, { onConflict: "post_id,reactor_username" });

    if (error) {
      console.log("Error upserting poll reactions:", error);
      return NextResponse.json(
        { error: "Failed to save poll reactions" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "Reactions saved successfully" }, { status: 200 });
}
