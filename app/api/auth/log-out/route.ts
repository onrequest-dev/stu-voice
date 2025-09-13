import { rateLimiterMiddleware } from "@/lib/rateLimiterMiddleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

  const rateLimitResponse = await rateLimiterMiddleware(request);
  if (rateLimitResponse) return rateLimitResponse;
  const jwt = request.cookies.get("jwt")?.value;
      if(!jwt) return NextResponse.json({ error: "You need to be logged in to log out."}, { status: 401 });
    return NextResponse.json(
        { message: "Logged out successfully." },
        {
            status: 200,
            headers: {
                "Set-Cookie": `jwt=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`,
            },
        }
    );
}