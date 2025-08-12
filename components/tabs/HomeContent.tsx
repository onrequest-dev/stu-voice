"use client";
import React from "react";
import PostComponent from "../postcomponents/PostComponent";
import PostSkeletonLoader from "../postcomponents/PostSkeletonLoader";
import { PostProps, UserInfo, Opinion, Poll } from "../postcomponents/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import RefreshAlert from "../RefreshAlert"
import { FaWifi, FaSync, FaNewspaper } from 'react-icons/fa';
import Link from "next/link";
import useVoteSync from "@/hooks/useVoteSync";

type Post = PostProps & {
  userInfo: UserInfo & { 
    faculty?: string;
    icon?: string;
  };
  opinion: Opinion | null;
  poll: Poll | null;
};

type PostResponse = {
  posts: Post[];
  nextCursor: { hot_score: number; id: number } | null;
  hasMore: boolean;
};

const HomeContent = () => {
  useVoteSync();
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "400px",
  });

  const fetchPosts = async ({ pageParam }: { pageParam: { hot_score: number; id: number } | null }): Promise<PostResponse> => {
    try {
      const response = await fetch("/api/opinions/get_foryou_opinions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cursor_hot_score: pageParam?.hot_score ?? null,
          cursor_id: pageParam?.id ?? null,
          page_size: 50,
          user_preferences: [],
        }),
      });

      if (!response.ok) {
        throw new Error(`خطأ في الشبكة: ${response.status}`);
      }

      const data = await response.json();
      return {
        posts: data.posts.map((post: any) => ({
          id: post.id,
          createdAt:post.created_at,
          userInfo: {
            id: post.publisher_username,
            iconName: post?.icon?.component || "user",
            iconColor: post?.icon?.color || "#ffffff",
            bgColor: post?.icon?.bgColor || "#6366f1",
            fullName: post.publisher_full_name,
            study: post?.faculty,
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
          poll: {"options":post?.poll?.options||[],"question":post?.poll?.title||"", "durationInDays": post?.poll?.durationInDays || -1}
        })),
        nextCursor: data.pagination?.nextCursor,
        hasMore: data.pagination?.hasMore,
      };
    } catch (error) {
      throw error;
    }
  };

const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  refetch,
  status,
} = useInfiniteQuery<PostResponse>({
  queryKey: ['posts'],
  queryFn: (context) => fetchPosts({ 
    pageParam: context.pageParam as { hot_score: number; id: number } | null 
  }),
  getNextPageParam: (lastPage) => {
    const nextParam = lastPage.hasMore ? lastPage.nextCursor : undefined;
    return nextParam;
  },
  initialPageParam: null,
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  retry: 2,
});

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPosts = data?.pages.flatMap(page => page.posts) || [];

  const handleRefresh = () => {
    refetch();
  };




  return (
    <div className="pb-12">
      <div className="max-w-2xl mx-auto space-y-6 scroll-smooth">
        {status === 'pending' && (
          <>
            <PostSkeletonLoader />
            <PostSkeletonLoader />
            <PostSkeletonLoader />
            <PostSkeletonLoader />
          </>
        )}

        {status === 'error' && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-transparent p-6 text-center max-w-md mx-4">
              <div className="text-red-500 mb-4">
                <FaWifi size={48} className="mx-auto" style={{ stroke: 'currentColor', strokeWidth: 1 }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-500 mb-2">
                انقطع الاتصال
              </h3>
              <p className="text-lg text-gray-500 mb-6">
                لا يمكن الاتصال بالخادم
              </p>
              <button
                onClick={handleRefresh}
                className="pointer-events-auto px-6 py-2 bg-transparent border-2 border-red-500 text-blue-500 rounded-full hover:bg-red-50 transition-colors flex items-center justify-center mx-auto text-lg font-medium"
              >
                <FaSync className="mr-4" />
                إعادة المحاولة
              </button>
              <p className="text-lg text-gray-500 mt-6">
                إذا كان الإنترنت متوفراً لديك 
              </p>
              <p className="text-lg text-gray-500 mb-6">
                تأكد من أنك قمت بتسجيل الدخول بشكل صحيح
              </p>
              <Link
                href={'/log-in'}
                className="pointer-events-auto px-6 py-2 bg-transparent border-2 border-blue-500 text-blue-500 rounded-full hover:bg-red-50 transition-colors flex items-center justify-center mx-auto text-lg font-medium"
              > قم بالتسجيل مجدداً
              </Link>
            </div>
          </div>
        )}

        {allPosts.map((post, index) => (
          <React.Fragment key={`${post.id}-${index}`}>
            <PostComponent
              id={post.id}
              userInfo={post.userInfo}
              opinion={post.opinion}
              poll={post.poll}
              createdAt={post.createdAt}
            />
            {index === allPosts.length - 1 && (
              <div 
                ref={ref} 
                className="h-1" 
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        ))}
        
        {isFetchingNextPage && (
          <>
            <PostSkeletonLoader />
            <PostSkeletonLoader />
            <PostSkeletonLoader />
            <PostSkeletonLoader />
            <PostSkeletonLoader />
            <PostSkeletonLoader />
          </>
        )}
        
        {!hasNextPage && !isFetchingNextPage && allPosts.length > 0 && (
          <RefreshAlert onRefresh={() => window.location.reload()} />
        )}

        {status === 'success' && allPosts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="text-gray-400">
                <FaNewspaper size={64} className="opacity-70" />
              </div>
              <h3 className="text-xl font-medium text-gray-600">لا توجد منشورات متاحة</h3>
              <p className="text-gray-500 max-w-md text-center px-4">
                لم يتم العثور على أي منشورات لعرضها حالياً. يمكنك المحاولة لاحقاً 
              </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default HomeContent;