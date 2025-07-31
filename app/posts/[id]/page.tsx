// app/posts/[id]/page.tsx
import PostWithComments from '@/components/postcomponents/PostWithComments';

export default function PostPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
<PostWithComments 
  postData={{
    id: "post123",
    userInfo: {
      id: "user123",
      iconName: "graduation",
      iconColor: "#ffffff",
      bgColor: "#3b82f6",
      fullName: "أحمد محمد",
      study: "طالب علوم حاسوب"
    },
    opinion: {
      text: "هذا رأيي حول الموضوع المطروح...",
      agreeCount: 24,
      disagreeCount: 2,
      readersCount: 156,
      commentsCount: 8
    }
  }}
  commentsData={{
    comments: [
      {
        id: "1",
        userId: "user456",
        text: "هذا المنشور رائع جداً!",
        likes: 5,
        timestamp: "منذ ساعتين"
      }
    ],
    users: {
      "user456": {
        id: "user456",
        iconName: "user",
        iconColor: "#ffffff",
        bgColor: "#10b981",
        fullName: "سارة علي",
        study: "طبية"
      }
    }
  }}
/>
    </div>
  );
}