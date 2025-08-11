import { decodeJWT } from "@/lib/decodejwt";
import { rateLimiterMiddleware } from "@/lib/rateLimiterMiddleware";
import { supabase } from "@/lib/supabase";
import { you_need_account_to_post } from "@/static/keywords";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

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
  const { vote_id } = body;

  if (!vote_id) {
    return NextResponse.json(
      { error: "مفقود معرف التصويت" },
      { status: 400 }
    );
  }
  const { data, error } = await supabase
    .from("polls_options")
    .select("*")
    .eq("vote_id", vote_id)
    if (error) {
      return NextResponse.json(
        { error: "حدث خطأ أثناء استرجاع التصويت" },
        { status: 500 }
      );
    }
    return NextResponse.json({ vote: data }, { status: 200 });
}
