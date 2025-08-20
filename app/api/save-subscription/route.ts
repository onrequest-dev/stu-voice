import { decodeJWT } from "@/lib/decodejwt";
import { rateLimiterMiddleware } from "@/lib/rateLimiterMiddleware";
import { supabase } from "@/lib/supabase";
import { validateAndSanitize } from "@/lib/validateAndSanitizePostBody";
import { INVALID_REQUEST, you_need_account_to_post } from "@/static/keywords";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


const subSchema = z.object({
  endpoint: z.string(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export async function POST(request: NextRequest) {
  const rateLimitResponse = await rateLimiterMiddleware(request);
  if (rateLimitResponse) return rateLimitResponse;

  const jwt = request.cookies.get("jwt")?.value;
  if (!jwt) return NextResponse.json({ error: you_need_account_to_post }, { status: 401 });

  const jwt_user = decodeJWT(jwt) as JwtPayload | null;
  if (!jwt_user || typeof jwt_user === "string" || !jwt_user.user_name) {
    return NextResponse.json({ error: you_need_account_to_post }, { status: 401 });
  }
  const body = await request.json();
  const {  data, errors } = validateAndSanitize(subSchema, body);
      if(errors){
        console.log(errors)
        return NextResponse.json(
          { error: INVALID_REQUEST },
          { status: 400 }
        );
      }
      const {data:subData, error:subError} = await supabase
      .from('webpush_subscriptions')
      .upsert({
        endpoint: data.endpoint,
        keys: data.keys,
        user_name : jwt_user.user_name
      });
      if(subError){
        console.log(subError)
         return NextResponse.json({ error: INVALID_REQUEST },
        { status: 400 })
      }
    return NextResponse.json({status:200});

}