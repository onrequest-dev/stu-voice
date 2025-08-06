import { NextRequest } from "next/server";

export async function POST(request:NextRequest){
    const body = await request.json();
    console.log("Received reaction:", body);
    

    // Here you would typically call your database or service to save the reaction
    // For example:
    // await saveReactionToDatabase({ reaction, postId });

    return new Response("Reaction saved", { status: 200 });
}