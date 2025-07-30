// app/posts/[id]/page.tsx
import PostWithComments from '@/components/postcomponents/PostWithComments';

export default function PostPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <PostWithComments postId={params.id} />
    </div>
  );
}