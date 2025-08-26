import { supabase } from "@/lib/supabase";

export async function getReationsHistoryFromBackend(user_name:string) {
    const {data,error} = await supabase
    .from("upvote_downvote_reactions")
    .select("reaction_type,post_id")
    .eq("reactor_username",user_name)
    if(error) return;
    const reactionshistory = data.map(d => ({ id: d.post_id, type: d.reaction_type }));
    return reactionshistory;
    
}