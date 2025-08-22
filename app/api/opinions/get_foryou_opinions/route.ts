import { decodeJWT } from "@/lib/decodejwt";
import { rateLimiterMiddleware } from "@/lib/rateLimiterMiddleware";
import { you_need_account_to_post } from "@/static/keywords";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const rateLimitResponse = await rateLimiterMiddleware(request);
  if (rateLimitResponse) return rateLimitResponse;

  const jwt = request.cookies.get("jwt")?.value;
  if (!jwt) return NextResponse.json({ error: you_need_account_to_post }, { status: 401 });

  const jwt_user = decodeJWT(jwt) as JwtPayload | null;
  if (!jwt_user || typeof jwt_user === "string" || !jwt_user.user_name) {
    return NextResponse.json({ error: you_need_account_to_post }, { status: 401 });
  }

  try {
    const {
      cursor_hot_score = null,
      cursor_id = null,
      page_size = 50,
      user_preferences = []
    } = await request.json();

    const { data: posts, error } = await supabase.rpc("get_foryou_opinions_fresh", {
        user_preferences,
        cur_hot_score: cursor_hot_score,
        cur_id: cursor_id,
        page_size: 50,
        fresh_ratio: 5 //%
        });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }

    let nextCursor = null;
    const shuffledPosts = shuffleArrayRarely(posts)

    if (posts.length > 0) {
      const lastPost = posts[posts.length - 1];
      nextCursor = {
        hot_score: lastPost.hot_score,
        id: lastPost.id
      };
    }
    const hasMore = posts.length === page_size;
    return NextResponse.json({
      posts:shuffledPosts,
      pagination: {
        nextCursor,
        hasMore
      }
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


function shuffleArrayRarely<T>(array: T[], swapProbability = 0.3): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    if (Math.random() < swapProbability) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  }
  return shuffled;
}



