// app/api/signup/route.ts

import { user_creation_failed, user_already_exists, username_and_password_required, user_created_successfully, not_trusted_device, } from "@/static/keywords";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeAndValidateInput } from "@/lib/sanitize";
import { supabase } from "@/lib/supabase";
import { rateLimiterMiddleware } from "@/lib/rateLimiterMiddleware";
import createJwt from "@/lib/create_jwt";
import { getUserIp } from "@/lib/get_userip";
import { processFingerprintData } from "@/lib/processFingerprintData";
import bcrypt from "bcryptjs";
import { userSchema } from "@/types/zodtypes";
import { sendNotificationToUser } from "@/lib/pushnotifcation";

// 1. تعريف شكل البيانات المتوقعة



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
  sendNotificationToUser(user.user_name,{
    "title": "مرحبا بك في  stuvoice!",
    "body":"لقد تم تسجيل حسابك بنجاح ✅ يرجى اكمال معلوماتك حتى تتمكن من متابعة نشاطك 😊😊\n  اضغط هنا لاستكمال معلوماتك!",
    "data":{"url":"/complete-profile"}
  })
  return response;
}
