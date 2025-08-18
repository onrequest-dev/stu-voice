import { decodeJWT } from "@/lib/decodejwt";
import { rateLimiterMiddleware } from "@/lib/rateLimiterMiddleware";
import { INVALID_REQUEST, you_need_account_to_post } from "@/static/keywords";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { CommentWithUser } from "@/app/posts/[id]/page";
import { z } from "zod";
import { validateAndSanitize } from "@/lib/validateAndSanitizePostBody";




const BodySchema = z.object({
  input_post_id: z.string(),
  input_comment_replied_to_id : z.string().optional(),

});

export async function POST(request: NextRequest) {
  const rateLimitResponse = await rateLimiterMiddleware(request);
  if (rateLimitResponse) return rateLimitResponse;

  const jwt = request.cookies.get("jwt")?.value;
  if (!jwt) return NextResponse.json({ error: you_need_account_to_post }, { status: 401 });

  const jwt_user = decodeJWT(jwt) as JwtPayload | null;
  if (!jwt_user || typeof jwt_user === "string" || !jwt_user.user_name) {
    return NextResponse.json({ error: you_need_account_to_post }, { status: 401 });
  }
  const body = await request.json();
  const {  data, errors } = validateAndSanitize(BodySchema, body);
    if(errors){
      console.log(errors)
      return NextResponse.json(
        { error: INVALID_REQUEST },
        { status: 400 }
      );
    }
  const {
    data: commentsRaw,
    error: commentsError,
  }: { data: CommentWithUser[] | null; error: any } = await supabase
    .rpc('fetch_comments_with_users', {
      input_post_id: data.input_post_id,
      input_comment_replied_to_id: data.input_comment_replied_to_id,
    });

  if (commentsError) {
    return NextResponse.json({ error: INVALID_REQUEST },
        { status: 400 })
  }
  return NextResponse.json({ status: 200 ,"comments":commentsRaw})
}