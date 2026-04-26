// app/api/verify-aiko/route.js
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    // السماح بـ CORS للدومين الذي سيطلب منه main.html
    const allowedOrigins = [// أي منفذ آخر
        'https://q-solar.vercel.app/',  // دومين الإنتاج
    ];
    
    const origin = request.headers.get('origin') || '';
    
    try {
        const body = await request.json();
        
        const response = await fetch('https://verify.aikosolar.com/verify/component/getInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        
        return NextResponse.json(data, {
            status: response.status,
            headers: {
                'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch from AIKO', message: (error as any).message },
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
                },
            }
        );
    }
}

// معالجة طلبات OPTIONS (preflight)
export async function OPTIONS(request: NextRequest) {
    const allowedOrigins = ['https://q-solar.vercel.app/'];
    const origin = request.headers.get('origin') || '';
    
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}