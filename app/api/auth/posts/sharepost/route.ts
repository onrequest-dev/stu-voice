import { decodeJWT } from "@/lib/decodejwt";
import { rateLimiterMiddleware } from "@/lib/rateLimiterMiddleware";
import { you_need_account_to_post } from "@/static/keywords";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest){
    const rateLimitResponse = await rateLimiterMiddleware(request);
      if (rateLimitResponse) return rateLimitResponse;

      const jwt = request.cookies.get("jwt")?.value;
    if(!jwt) return NextResponse.json({ error: you_need_account_to_post }, { status: 401 });

      const jwt_user = decodeJWT(jwt) as JwtPayload | null;
      if (!jwt_user || typeof jwt_user === 'string' || !jwt_user.id) {
    return NextResponse.json({ error: you_need_account_to_post }, { status: 500 });
  }
  const validatedData = await validateAndSanitizeRequestBody(request);

  if ("error" in validatedData) {
    return NextResponse.json(
      { error: validatedData.error, details: validatedData.details },
      { status: 400 }
    );
  }
    const { post, topics, poll_id } = validatedData;
    

} 







async function validateAndSanitizeRequestBody(request: NextRequest) {
  const body = await request.json();

  const schema = z.object({
    post: z.string(),
    topics: z.string(),
    poll_id: z.string().optional(),
  });

  const parseResult = schema.safeParse(body);

  if (!parseResult.success) {
      return {
    error: "Invalid request body",
    details: parseResult.error.format(), // بدلاً من .errors
  };
  }

  const data = parseResult.data;

  // تنظيف المواضيع - بدون وسوم
  const cleanTopics = sanitizeHtml(data.topics, {
    allowedTags: [],
    allowedAttributes: {},
  });

  // تنظيف post - بدون وسوم مع الإبقاء على النص كاملاً بما فيه @ و #
  const cleanPost = sanitizeHtml(data.post, {
    allowedTags: [],
    allowedAttributes: {},
  });

  // تنظيف poll_id اذا موجود
  const cleanPollId = data.poll_id ? sanitizeHtml(data.poll_id, {
    allowedTags: [],
    allowedAttributes: {},
  }) : undefined;

  return {
    post: cleanPost,
    topics: cleanTopics,
    poll_id: cleanPollId,
  };
}
