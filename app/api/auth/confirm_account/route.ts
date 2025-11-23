// import { randomDelay } from "@/client_helpers/delay";
import createJwt from "@/lib/create_jwt";
import { decodeJWT } from "@/lib/decodejwt";
import { sendNotificationToUser } from "@/lib/pushnotifcation";
import { rateLimiterMiddleware } from "@/lib/rateLimiterMiddleware";
import { you_need_account_to_post } from "@/static/keywords";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const rateLimitResponse = await rateLimiterMiddleware(request);
  if (rateLimitResponse) return rateLimitResponse;

  const jwt = request.cookies.get("jwt")?.value;
  if (!jwt) return NextResponse.json({ error: you_need_account_to_post }, { status: 401 });
  const jwt_user = decodeJWT(jwt) as JwtPayload | null;
    if (!jwt_user || typeof jwt_user === "string" || !jwt_user.user_name) {
      return NextResponse.json({ error: you_need_account_to_post }, { status: 401 });
    }
  // await randomDelay(2);

    const response =  NextResponse.json({status:200});

  if(!jwt_user.confirmed_account){
     sendNotificationToUser(jwt_user.user_name,{
    "title": "مرحبا بك في  stuvoice!",
    "body":"لقد تم تسجيل حسابك بنجاح ✅ يرجى اكمال معلوماتك حتى تتمكن من متابعة نشاطك 😊😊\n  اضغط هنا لاستكمال معلوماتك!",
    "data":{"url":"/complete-profile"}
  });
  const jwt_copy = createJwt({...jwt_user,confirmed_account:true})
  response.cookies.set("jwt", jwt_copy || "", { path: "/", maxAge: 60 * 60 * 24 * 365 * 20, httpOnly: true });


    }
    if(jwt_user.confirmed_account&&jwt_user.confirmed_account==true){
        sendNotificationToUser(jwt_user.user_name,
            {"title":`مرحبا بعودتك ${jwt_user.user_name} 😊😊`,"body":""}
        )
    }
    return response;

    



}