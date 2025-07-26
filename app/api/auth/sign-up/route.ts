// app/api/signup/route.ts
import { z } from "zod";
import { password_should_be_at_least_6_characters, user_creation_failed, user_already_exists, user_name_shouldbe_at_least_3_characters, username_and_password_required } from "@/static/keywords";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeAndValidateInput } from "@/lib/sanitize";
import { supabase } from "@/lib/supabase";
import { rateLimiterMiddleware } from "@/lib/rateLimiterMiddleware";

// 1. تعريف شكل البيانات المتوقعة
const userSchema = z.object({
  username: z.string().min(3, user_name_shouldbe_at_least_3_characters),
  password: z.string().min(6, password_should_be_at_least_6_characters),
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
  const { data, error } = sanitizeAndValidateInput(body, userSchema);

  if (error || !data) {
    return NextResponse.json({ error: error ?? username_and_password_required }, { status: 400 });
  }
    const { username, password } = data;
    // 3. إنشاء المستخدم في قاعدة البيانات
    const { data: user, error: dbError } = await supabase
        .from("users")
        .insert([{ "user_name": username, "hashed_password": password }])
        .select()
        .single();

if (dbError) {
     if (dbError.code === "23505" || dbError.message.includes("duplicate key")) {
          // رمز الخطأ 23505 هو تعارض مفتاح فريد (اسم مستخدم موجود)
          return NextResponse.json({ error: user_already_exists }, { status: 409 });
     }
     return NextResponse.json({ error: user_creation_failed }, { status: 500 });
}


  return new Response(JSON.stringify({ message: "User created successfully" }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
