export async function getcomments(body:{
    input_post_id:string|number,
    input_comment_replied_to_id:string|number
}) {
     const response = await fetch("/api/comments/getreplies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // مهم حتى يتم إرسال الكوكيز (مثل jwt)
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Unknown error occurred" };
    }
    return data;

}