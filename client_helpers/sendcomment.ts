type PostCommentPayload = {
  content: string;
  id: number|string;
  comment_replied_to_id?: number|string;
};

type SuccessResponse = {
  message: string;
  post: any;
};

type ErrorResponse = {
  error: string;
};

export async function postComment(
  payload: PostCommentPayload
): Promise<SuccessResponse | ErrorResponse> {
  try {
    let p:PostCommentPayload ={
      content : payload.content,
      id : payload.id.toString(),
      comment_replied_to_id : payload.comment_replied_to_id?.toString()
    }
    const response = await fetch("/api/opinions/postcomment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // مهم حتى يتم إرسال الكوكيز (مثل jwt)
      body: JSON.stringify(p),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Unknown error occurred" };
    }

    return data as SuccessResponse;
  } catch (error) {
    return { error: "Network error or unexpected failure" };
  }
}
