
export function transformPost(post: any) {
  return {
    id: post.id.toString(),
    userInfo: {
      id: post.publisher_username,
      iconName: post.icon?.component || 'user',  // غيرت من name لـ component حسب داتا الـ API
      iconColor: post.icon?.color || '#2600ffff',
      bgColor: post.icon?.bgColor || '#ffffffff',
      fullName: post.publisher_full_name,
      study: post.faculty,
    },
    opinion: post.post
      ? {
          text: post.post,
          agreeCount: post.upvotes,
          disagreeCount: post.downvotes,
          readersCount: 0,
          commentsCount: 0,
        }
      : null,
    poll: {"options":post?.poll?.options||[],"question":post?.poll?.title||"", "durationInDays": post?.poll?.durationInDays || -1},
    createdAt: post.created_at,
    showDiscussIcon: true,
  };
}
