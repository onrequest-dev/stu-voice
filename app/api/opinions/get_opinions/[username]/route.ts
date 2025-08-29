import { decodeJWT } from "@/lib/decodejwt";
import { rateLimiterMiddleware } from "@/lib/rateLimiterMiddleware";
import { supabase } from "@/lib/supabase";
import { you_need_account_to_post } from "@/static/keywords";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const rateLimitResponse = await rateLimiterMiddleware(request);
  if (rateLimitResponse) return rateLimitResponse;

  const jwt = request.cookies.get("jwt")?.value;
  if (!jwt)
    return NextResponse.json({ error: you_need_account_to_post }, { status: 401 });

  const jwt_user = decodeJWT(jwt) as JwtPayload | null;
  if (!jwt_user || typeof jwt_user === "string" || !jwt_user.user_name) {
    return NextResponse.json({ error: you_need_account_to_post }, { status: 500 });
  }

  const username = params.username;
  const isValid = /^[a-zA-Z0-9_]+$/.test(username);
  if (!isValid) {
    return new Response("Invalid username", { status: 400 });
  }

  const { data: postDataRaw, error: postError } = await supabase
    .rpc("get_posts_by_id_or_publisher", {
      target_id: null,
      target_username: username,
    });

  if (postError) return NextResponse.json({ error: "something went wrong" }, { status: 500 });

  return NextResponse.json(postDataRaw, { status: 200 });
}
