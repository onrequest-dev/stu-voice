// app/posts/[id]/page.tsx
import PostWithComments from '@/components/postcomponents/Comment/PostWithComments';

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
          },
          poll: {
            question: "كم مرة تزور المكتبة المركزية أسبوعياً؟",
            options: ["أقل من مرة", "1-2 مرات", "3-5 مرات", "أكثر من 5 مرات"],
            votes: [30, 45, 20, 5],
            durationInDays: -1, 
          }
        }}

      />
    </div>
  );
}