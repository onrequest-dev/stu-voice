import { decodeJWT } from "@/lib/decodejwt";
import { rateLimiterMiddleware } from "@/lib/rateLimiterMiddleware";
import { Failed_to_create_post, Post_created_successfully, you_need_account_to_post } from "@/static/keywords";
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
      if (!jwt_user || typeof jwt_user === 'string' || !jwt_user.user_name) {
    return NextResponse.json({ error: you_need_account_to_post }, { status: 500 });
  }
  const validatedData = await validateAndSanitizeRequestBody(request);

  if ("error" in validatedData) {
    return NextResponse.json(
      { error: validatedData.error, details: validatedData.details },
      { status: 400 }
    );
  }
  const { post, topics, poll } = validatedData;
    const user_name = jwt_user.user_name;
    
    const {data: db, error:dbError} = await supabase
    .from('posts')
    .insert({
      post,
      topics,
      publisher_username: user_name,
      poll: poll  // تحويل الاستطلاع إلى نص إذا كان موجودًا
    }).select("id")

    

    if (dbError) {
      return NextResponse.json({ error: Failed_to_create_post }, { status: 500 });
    }

    const postId = db[0].id;

// 👇 إضافة خيارات التصويت إذا كانت موجودة
if (poll) {
  const optionsToInsert = poll.options.map(option => ({
    vote_id: postId,
    title: option,
  }));

  const { error: pollError } = await supabase
    .from('polls_options')
    .insert(optionsToInsert);
    if (pollError) {
      return NextResponse.json({ error: Failed_to_create_post }, { status: 500 });
    }
}

    return NextResponse.json({ message: Post_created_successfully, post: db }, { status: 201 });
}






async function validateAndSanitizeRequestBody(request: NextRequest) {
  const body = await request.json();

  const schema = z.object({
    post: z.string().optional().default(''),     // قد يكون فارغاً
    topics: z.string().optional().default(''),   // قد يكون فارغاً
    poll: z
      .object({
        title: z.string().optional().default(''),
        options: z.array(z.string().min(1)).min(2).max(5),
        durationInDays: z.number().min(1).max(30).optional(),
      })
      .optional(),
  });

  const parseResult = schema.safeParse(body);

  if (!parseResult.success) {
    return {
      error: "Invalid request body",
      details: parseResult.error.format(),
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

  // تنظيف الاستطلاع اذا موجود
  let cleanPoll;
  if (data.poll) {
    const cleanTitle = sanitizeHtml(data.poll.title, {
      allowedTags: [],
      allowedAttributes: {},
    });

    // نظف كل خيار في المصفوفة
    const cleanOptions = data.poll.options.map(option =>
      sanitizeHtml(option, {
        allowedTags: [],
        allowedAttributes: {},
      })
    );

    cleanPoll = {
      title: cleanTitle,
      options: cleanOptions,
    };
  }

  return {
    post: cleanPost,
    topics: cleanTopics,
    poll: cleanPoll,
  };
}
