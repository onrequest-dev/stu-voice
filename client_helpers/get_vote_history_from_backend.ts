import { supabase } from "@/lib/supabase";

export async function getVotesHistoryFromBackend(user_name:string) {
    const {data,error} = await supabase
    .from("poll_reactions")
    .select("poll_option,post_id")
    .eq("reactor_username",user_name)
    if(error) return;
    const voteshistory = data.map(d => ({ id: d.post_id, type: d.poll_option }));
    return voteshistory;
}