import React, { useEffect, useState, useRef } from "react";
import PostComponent from "../postcomponents/PostComponent";

interface Post {
  id: string;
  userInfo: {
    id: string;
    iconName: string;
    iconColor: string;
    bgColor: string;
    fullName: string;
    study: string;
    faculty?: string;
    icon?: string;
  };
  opinion: {
    text: string;
    agreeCount: number;
    disagreeCount: number;
    readersCount: number;
    commentsCount: number;
  } | null;
  poll: any;
}

const HomeContent = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  const fetchPosts = async (pageNumber: number) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const response = await fetch("/api/opinions/get_foryou_opinions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: pageNumber, pageSize: 50, user_preferences: [] }),
      });
      const data = await response.json();
      console.log("Fetched posts:", data);
      const mappedPosts: Post[] = data.posts.map((post: any) => ({
        id: post.id,
        userInfo: {
          id: post.publisher_username,
          iconName: post?.icon?.component||"user",
          iconColor: post?.icon?.color||"#ffffff",
          bgColor: post?.icon?.bgColor||"#6366f1",
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
        poll: post.poll,
      }));

      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const filteredNew = mappedPosts.filter((p) => !existingIds.has(p.id));
        return [...prev, ...filteredNew];
      });

      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Fetch posts when page changes
  useEffect(() => {
    console.log(`Fetching posts for page ${page}`);
    fetchPosts(page);
  }, [page]);

  // IntersectionObserver لتحميل صفحات عند الاقتراب من النهاية
  useEffect(() => {
  if (totalPages === null) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (
        entries[0].isIntersecting &&
        !isFetchingRef.current &&
        page < totalPages
      ) {
        setPage((prev) => prev + 1);
      }
    },
    {
      rootMargin: "1000px", // تحميل مبكر قبل الوصول
      threshold: 0,
    }
  );

  const current = loaderRef.current;

  if (current) {
    observer.observe(current);
  }

  // 💡 إعادة تفعيل كل مرة بعد التحديث
  return () => {
    if (current) observer.unobserve(current);
  };
}, [page, totalPages, loading]); // ← أعد التفعيل كل مرة تتغير الصفحة أو يتم تحميل جديد


  // تحميل تلقائي كل 10 ثواني حتى لو ما تم تمرير الصفحة
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (!loading && totalPages !== null && page < totalPages && !isFetchingRef.current) {
  //       setPage((prev) => prev + 1);
  //     }
  //   }, 10000); // 10 ثواني

  //   return () => clearInterval(interval);
  // }, [loading, page, totalPages]);

  return (
    <div className="pb-12">
      <div className="max-w-2xl mx-auto space-y-6">
        {posts.map((post) => (
          <PostComponent
            key={post.id}
            id={post.id}
            userInfo={post.userInfo}
            opinion={post.opinion}
            poll={post.poll}
          />
        ))}
        <div ref={loaderRef} style={{ height: "1px" }}></div>
        {loading && <p className="text-center">جاري تحميل المزيد...</p>}
      </div>
    </div>
  );
};

export default HomeContent;
