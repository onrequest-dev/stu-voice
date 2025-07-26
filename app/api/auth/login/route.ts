import { rateLimiterMiddleware } from "@/lib/rateLimiterMiddleware";
import { sanitizeAndValidateInput } from "@/lib/sanitize";
import { supabase } from "@/lib/supabase";
import { username_and_password_required } from "@/static/keywords";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { userSchema } from "../sign-up/route";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const rateLimitResponse = await rateLimiterMiddleware(request);
  if (rateLimitResponse) return rateLimitResponse;

  const { data, error } = sanitizeAndValidateInput(
    { username: body.username, password: body.password },
    userSchema
  );

  if (error || !data) {
    return NextResponse.json({ error: username_and_password_required }, { status: 400 });
  }

  const { username, password } = data;

  // 1. جلب المستخدم من قاعدة البيانات
  const { data: existingUser, error: dbError } = await supabase
    .from('users')
    .select('user_name, hashed_password')
    .eq('user_name', username)
    .single();
    console.log("Existing user:", existingUser, dbError);

  if (dbError || !existingUser) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  // 2. مقارنة كلمة المرور باستخدام bcrypt.compare
  const isPasswordValid = await bcrypt.compare(password, existingUser.hashed_password);

  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  // 3. تسجيل الدخول ناجح — يمكنك الآن توليد JWT أو جلسة (Session)
  return NextResponse.json({ message: "Login successful" }, { status: 200 });
}
