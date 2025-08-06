import { z } from "zod";
import sanitizeHtml from "sanitize-html";

// file: /app/api/vote/route.ts (مثال مسار API في Next.js 13+)
import { decodeJWT } from "@/lib/decodejwt";
import { rateLimiterMiddleware } from "@/lib/rateLimiterMiddleware";
import { you_need_account_to_post } from "@/static/keywords";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function POST(request: NextRequest) {
  // تحقق من الحد الأقصى للطلبات
  const rateLimitResponse = await rateLimiterMiddleware(request);
  if (rateLimitResponse) return rateLimitResponse;

  // التحقق من وجود JWT في الكوكيز وفك تشفيره
  const jwt = request.cookies.get("jwt")?.value;
  if (!jwt)
    return NextResponse.json(
      { error: you_need_account_to_post },
      { status: 401 }
    );

  const jwt_user = decodeJWT(jwt) as JwtPayload | null;
  if (!jwt_user || typeof jwt_user === "string" || !jwt_user.user_name) {
    return NextResponse.json(
      { error: you_need_account_to_post },
      { status: 401 }
    );
  }

  // قراءة جسم الطلب JSON
  const body = await request.json().catch(() => null);
  if (!body)
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );

  // تحقق vote_id
  if (typeof body.vote_id !== "number" || body.vote_id <= 0) {
    return NextResponse.json(
      { error: "Invalid vote_id" },
      { status: 400 }
    );
  }

  // تنظيف والتحقق من عنوان الخيار
  const cleanOptionTitle = validateAndSanitizeTitle(body.option_title);
  if (!cleanOptionTitle) {
    console.log("not clean")
    return NextResponse.json(
      { error: "Invalid or empty option_title" },
      { status: 400 }
    );
  }

  // استدعاء دالة RPC في Supabase
  const { data, error } = await supabase.rpc("vote_poll_option_by_title", {
    _vote_id: body.vote_id,
    _option_title: cleanOptionTitle,
    _user_name: jwt_user.user_name,
  });

  if (error) {
    console.log(error)
    return NextResponse.json(
      { error: error.message || "Voting error" },
      { status: 400 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "No data returned from voting function" },
      { status: 500 }
    );
  }

  // إرجاع خيارات التصويت بعد التحديث
  return NextResponse.json({ options: data });
}









// file: /lib/validation.ts

const OptionTitleSchema = z.string().min(1).max(100);

export function validateAndSanitizeTitle(title: unknown): string | null {
  const parseResult = OptionTitleSchema.safeParse(title);
  if (!parseResult.success) return null;

  const cleanTitle = sanitizeHtml(parseResult.data, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();

  if (!cleanTitle) return null;

  return cleanTitle;
}
