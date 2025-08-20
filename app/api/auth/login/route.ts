import { rateLimiterMiddleware } from "@/lib/rateLimiterMiddleware";
import { sanitizeAndValidateInput } from "@/lib/sanitize";
import { supabase } from "@/lib/supabase";
import {  user_loged_in_successfully, username_and_password_required } from "@/static/keywords";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import createJwt from "@/lib/create_jwt";
import { getUserIp } from "@/lib/get_userip";
import { userSchema } from "@/types/zodtypes";

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
    .select('user_name, hashed_password,icon,university,level,faculty,gender,info')
    .eq('user_name', username)
    .single();
  if (dbError || !existingUser) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  // 2. مقارنة كلمة المرور باستخدام bcrypt.compare
  const isPasswordValid = await bcrypt.compare(password, existingUser.hashed_password);

  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  // 3. تسجيل الدخول ناجح — يمكنك الآن توليد JWT أو جلسة (Session)
  const user_ip = getUserIp(request);
    const jwt = createJwt({
        user_name:username,
        ip: user_ip || "unknown", //
        });
  
    
    const response = NextResponse.json({ status: 200, message:user_loged_in_successfully,icon:existingUser.icon,university:existingUser.university,level:existingUser.level,faculty:existingUser.faculty,gender:existingUser.gender,info:existingUser.info});
    response.cookies.set("jwt", jwt || "", { path: "/", maxAge: 60 * 60 * 24 * 365 * 20, httpOnly: true });
    return response;
}
