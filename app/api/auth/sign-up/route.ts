// app/api/signup/route.ts
import { z } from "zod";
import { password_should_be_at_least_n_characters, user_creation_failed, user_already_exists, user_name_shouldbe_at_least_n_characters, username_and_password_required, user_created_successfully, not_trusted_device, password_shouldbe_at_most_n_characters, user_name_shouldbe_at_most_n_characters } from "@/static/keywords";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeAndValidateInput } from "@/lib/sanitize";
import { supabase } from "@/lib/supabase";
import { rateLimiterMiddleware } from "@/lib/rateLimiterMiddleware";
import createJwt from "@/lib/create_jwt";
import { getUserIp } from "@/lib/get_userip";
import { processFingerprintData } from "@/lib/processFingerprintData";
import bcrypt from "bcryptjs";

// 1. تعريف شكل البيانات المتوقعة
export const userSchema = z.object({
  username: z.string()
    .min(4, user_name_shouldbe_at_least_n_characters)
    .max(20, user_name_shouldbe_at_most_n_characters),
  password: z.string()
    .min(6, password_should_be_at_least_n_characters)
    .max(64, password_shouldbe_at_most_n_characters),
  fingerprint: z
    .object({})
    .passthrough()
    .optional(), // ← يمكن أن تكون موجودة أو لا
});
export type jwt_user = {
    user_name: string;
    ip: string;

}


export async function POST(request: NextRequest) {
  const body = await request.json();
    const rateLimitResponse = await rateLimiterMiddleware(request);
    if (rateLimitResponse) return rateLimitResponse;
  // 2. تعقيم + تحقق
  const { data, error } = sanitizeAndValidateInput({username: body.username, password: body.password}, userSchema);
  const saltRounds = 10;
  
  if (error || !data) {
    return NextResponse.json({ error: error ?? username_and_password_required }, { status: 400 });
  }
  const { username, password } = data;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
    // 3. إنشاء المستخدم في قاعدة البيانات
    // التحقق من البصمة الرقمية (fingerprint) إذا كانت موجودة
    const fingerprintResult = processFingerprintData(body.fingerprint);

    if ('error' in fingerprintResult) {
        return NextResponse.json({ error: fingerprintResult.error }, { status: 400 });
    }

    const hash = fingerprintResult.hash;
    const trustScore = 'trustScore' in fingerprintResult ? fingerprintResult.trustScore : undefined;
    const metadata = 'metadata' in fingerprintResult ? fingerprintResult.metadata : undefined;
    if(trustScore && trustScore < 40) {
      return NextResponse.json({ error: not_trusted_device }, { status: 400 });
    }
    
    const { data: user, error: dbError } = await supabase
        .from("users")
        .insert([{ "user_name": username, "hashed_password": hashedPassword , "fingerprint_hash": hash, "fingerprint_metadata": metadata, "trust_score": trustScore }])
        .select()
        .single();
    console.log("User creation result:", user, dbError);
if (dbError) {
     if (dbError.code === "23505" || dbError.message.includes("duplicate key")) {
          // رمز الخطأ 23505 هو تعارض مفتاح فريد (اسم مستخدم موجود)
          return NextResponse.json({ error: user_already_exists }, { status: 409 });
     }
     return NextResponse.json({ error: user_creation_failed }, { status: 500 });
}

  const user_ip = getUserIp(request);
  const jwt = createJwt({
      user_name: user.user_name,
      ip: user_ip || "unknown", //
      });

  
  const response = NextResponse.json({ status: 200, message:user_created_successfully});
  response.cookies.set("jwt", jwt || "", { path: "/", maxAge: 60 * 60 * 24 * 365 * 20, httpOnly: true });
  return response;
}
