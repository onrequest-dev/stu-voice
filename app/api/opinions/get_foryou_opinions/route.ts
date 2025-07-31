import { decodeJWT } from "@/lib/decodejwt";
import { rateLimiterMiddleware } from "@/lib/rateLimiterMiddleware";
import { you_need_account_to_post } from "@/static/keywords";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";



export async function POST(request: NextRequest) {
    console.log("1")
    // التحقق من معدل الطلبات
    const rateLimitResponse = await rateLimiterMiddleware(request);
    if (rateLimitResponse) return rateLimitResponse;
    
    // التحقق من وجود JWT
    const jwt = request.cookies.get("jwt")?.value;
    if(!jwt) return NextResponse.json({ error: you_need_account_to_post }, { status: 401 });
    
    // فك تشفير JWT
    const jwt_user = decodeJWT(jwt) as JwtPayload | null;
    if (!jwt_user || typeof jwt_user === 'string' || !jwt_user.user_name) {
        return NextResponse.json({ error: you_need_account_to_post }, { status: 500 });
    }
    
    try {
        // جلب معاملات الصفحة من body الطلب
        const { page = 1, pageSize = 150 , user_preferences = []} = await request.json();

        // حساب نقطة البداية
        const startIndex = (page - 1) * pageSize;
        
        // استدعاء الدالة من Supabase مع تفضيلات فارغة
        const { data: posts, error, count } = await supabase
            .rpc('get_foryou_opinions', { 
                user_preferences 
            })
            .select('*')
            .range(startIndex, startIndex + pageSize - 1);
        
        if (error) {
            console.error('Error fetching hot posts:', error);
            return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
        }

        // جلب العدد الإجمالي للمنشورات للتقسيم إلى صفحات
        const { count: totalCount } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true });

        return NextResponse.json({
            posts,
            pagination: {
                currentPage: page,
                pageSize,
                totalItems: totalCount || 0,
                totalPages: Math.ceil((totalCount || 0) / pageSize)
            }
        });
        
    } catch (error) {
        console.error('Error in posts endpoint:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}