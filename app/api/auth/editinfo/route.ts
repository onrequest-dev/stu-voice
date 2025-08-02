import { decodeJWT } from "@/lib/decodejwt";
import { rateLimiterMiddleware } from "@/lib/rateLimiterMiddleware";
import { sanitizeAndValidateInput } from "@/lib/sanitize";
import { supabase } from "@/lib/supabase";
import { Failed_to_update, info_not_valid, User_information_updated_successfully, you_can_update_info_once_a_week, you_need_account_to_edit } from "@/static/keywords";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server"
import { addDays, isBefore } from "date-fns";import { UserInfoSchema } from "@/types/zodtypes";



export async function POST(request: NextRequest) {
    const rateLimitResponse = await rateLimiterMiddleware(request);
      if (rateLimitResponse) return rateLimitResponse;

      const jwt = request.cookies.get("jwt")?.value;
    if(!jwt) return NextResponse.json({ error: you_need_account_to_edit }, { status: 401 });

      const jwt_user = decodeJWT(jwt) as JwtPayload | null;
      console.log('Decoded JWT:', jwt_user);
      console.log(!jwt_user)
      if (!jwt_user || typeof jwt_user === 'string' || !jwt_user.user_name) {
    return NextResponse.json({ error: you_need_account_to_edit }, { status: 500 });
      }
    const body = await request.json();
    const { data, error } = sanitizeAndValidateInput(body,UserInfoSchema);
    if (error || !data) {
        return NextResponse.json({ info_not_valid }, { status: 400 });
    }
    const username = jwt_user.user_name
    const { data: userRecord, error: fetchError } = await supabase
    .from("users")
    .select("last_time_updated")
    .eq("user_name",username)
    .single();
    if(fetchError) return NextResponse.json({you_need_account_to_edit},{status:400});

    const now = new Date();
    if (
    userRecord?.last_time_updated &&
    isBefore(now, addDays(new Date(userRecord.last_time_updated), 7))
  ) {
    return NextResponse.json(
      { error: you_can_update_info_once_a_week },
      { status: 403 }
    );
  }

  const {error:updateError} = await supabase
    .from("users")
    .update({
        full_name: data.fullName,
        level : data.education.level,
        university: data.education.university,
        faculty: data.education.faculty,
        icon: data.education.icon,
        gender:data.gender,
        last_time_updated: now.toISOString(), // update timestamp
        info : {
           "grade": data.education.grade,
            "track": data.education.track,
            "degreeSeeking":data.education.degreeSeeking,
            "specialization": data.education.specialization,
            "year": data.education.year,
            "studentId": data.education.studentId
        }
        
    }).eq("user_name", username)

     if (updateError) {
    return NextResponse.json({ error: Failed_to_update }, { status: 500 });
  }
  return NextResponse.json({ message: User_information_updated_successfully }, { status: 200 });
    
}