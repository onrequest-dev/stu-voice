// middleware/rateLimiterMiddleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from './rateLimiter';


export async function rateLimiterMiddleware(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('remote-addr');
    if (!ip) {
        return NextResponse.json({
            message: "Unable to determine client IP"
        }, {
            status: 400,
        });``
    }

    const { allowed, ttl } = rateLimiter(ip);
    if (!allowed) {
        return NextResponse.json({
            message: `Rate limit exceeded. Try again in ${Math.ceil(ttl)} seconds.`
        }, {
            status: 429,
        });
    }

    return null;
}