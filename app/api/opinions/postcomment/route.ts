import { decodeJWT } from "@/lib/decodejwt";
import { extractMentions } from "@/lib/extract_mentions";
import { sendNotificationToUser } from "@/lib/pushnotifcation";
import { rateLimiterMiddleware } from "@/lib/rateLimiterMiddleware";
import { supabase } from "@/lib/supabase";
import { validateAndSanitize } from "@/lib/validateAndSanitizePostBody";
import { INVALID_REQUEST, you_need_account_to_post } from "@/static/keywords";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import {  z } from "zod";




const PostSchema = z.object({
  content: z.string().min(1).max(5000),
  id : z.string(),
  comment_replied_to_id : z.string().optional(),

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


  const body = await request.json();
  const {  data, errors } = validateAndSanitize(PostSchema, body);
  if(errors){
    return NextResponse.json(
      { error: INVALID_REQUEST },
      { status: 400 }
    );
  }
  const {content,id,comment_replied_to_id} = data;
  const { data: post, error } = await supabase
    .from("comments")
    .insert({
      content,
      post_id: id,
      comment_replied_to_id: comment_replied_to_id,
      commenter_username: jwt_user.user_name,
    })
    .select()
    .single();
        if(error){
        return NextResponse.json(
        { error: INVALID_REQUEST },
        { status: 400 }
        );
    }
    const mentions = extractMentions(content,jwt_user.user_name);
    sendNotificationToUser(mentions,{
      "body":`${content.replace(/@\w+/g, '').slice(0, 10)}...`
      ,"title":`ذكرك ${jwt_user.user_name} في مناقشة!`,
      "data":{"url":`/talk/${id}`},
    });
    return NextResponse.json(
      { message: "Comment posted successfully", post },
    );

}