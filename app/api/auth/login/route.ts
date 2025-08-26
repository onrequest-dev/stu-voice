import { rateLimiterMiddleware } from "@/lib/rateLimiterMiddleware";
import { sanitizeAndValidateInput } from "@/lib/sanitize";
import { supabase } from "@/lib/supabase";
import {  user_loged_in_successfully, username_and_password_required } from "@/static/keywords";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import createJwt from "@/lib/create_jwt";
import { getUserIp } from "@/lib/get_userip";
import { userSchema } from "@/types/zodtypes";
import { getVotesHistoryFromBackend } from "@/client_helpers/get_vote_history_from_backend";
import { getReationsHistoryFromBackend } from "@/client_helpers/get_reacions_history_from_backend";

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
    .select('user_name, hashed_password,icon,university,level,faculty,gender,info,last_time_updated,full_name')
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

  const voteshistory = await getVotesHistoryFromBackend(username);
  const reactionshistory = await getReationsHistoryFromBackend(username)

  const user_ip = getUserIp(request);
  const has_complited_info = existingUser.last_time_updated!=null
    const jwt = createJwt({
        user_name:username,
        ip: user_ip || "unknown", //
        has_complited_info:has_complited_info
        });
  
    
    const response = NextResponse.json({ 
      status: 200,
       message:user_loged_in_successfully,
       icon:existingUser.icon,
       university:existingUser.university,
       level:existingUser.level,faculty:existingUser.faculty
       ,gender:existingUser.gender
       ,info:existingUser.info
       ,voteshistory
       ,reactionshistory
       ,fullname:existingUser.full_name,
       username:username
    });
    response.cookies.set("jwt", jwt || "", { path: "/", maxAge: 60 * 60 * 24 * 365 * 20, httpOnly: true });
    return response;
}
