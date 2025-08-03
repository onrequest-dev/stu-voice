import React, { useEffect, useState, useRef, useCallback } from "react";
import PostComponent from "../postcomponents/PostComponent";
import PostSkeletonLoader from "../postcomponents/PostSkeletonLoader";

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
  createdAt?: string;
}

const HomeContent = () => {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = sessionStorage.getItem("posts");
    return saved ? JSON.parse(saved) : [];
  });

  type Cursor = { hot_score: number; id: number } | null;
  const [cursor, setCursor] = useState<Cursor>(() => {
    const saved = sessionStorage.getItem("cursor");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  const [hasMore, setHasMore] = useState(() => {
    const saved = sessionStorage.getItem("hasMore");
    return saved ? JSON.parse(saved) : true;
  });

  // حفظ الحالة في sessionStorage عند أي تغير
  useEffect(() => {
    sessionStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    sessionStorage.setItem("cursor", JSON.stringify(cursor));
  }, [cursor]);

  useEffect(() => {
    sessionStorage.setItem("hasMore", JSON.stringify(hasMore));
  }, [hasMore]);

  // حفظ موقع التمرير عند خروج الصفحة
  useEffect(() => {
    const saveScrollPosition = () => {
      sessionStorage.setItem("scrollPosition", JSON.stringify(window.scrollY));
    };

    window.addEventListener("beforeunload", saveScrollPosition);
    window.addEventListener("pagehide", saveScrollPosition);

    return () => {
      window.removeEventListener("beforeunload", saveScrollPosition);
      window.removeEventListener("pagehide", saveScrollPosition);
    };
  }, []);

  // استعادة موقع التمرير عند التحميل
 useEffect(() => {
  const saveScrollPosition = () => {
    sessionStorage.setItem("scrollPosition", JSON.stringify(window.scrollY));
  };

  window.addEventListener("beforeunload", saveScrollPosition);
  window.addEventListener("pagehide", saveScrollPosition);

  return () => {
    window.removeEventListener("beforeunload", saveScrollPosition);
    window.removeEventListener("pagehide", saveScrollPosition);
  };
}, []);



  // حذف البيانات عند تحميل الصفحة (refresh)
  useEffect(() => {
    sessionStorage.removeItem("posts");
    sessionStorage.removeItem("cursor");
    sessionStorage.removeItem("hasMore");
    // لا نحذف scrollPosition هنا لكي نستعيد موضع التمرير
  }, []);

  const fetchPosts = useCallback(
    async (cursorToUse: Cursor) => {
      if (isFetchingRef.current || !hasMore) return;
      isFetchingRef.current = true;
      setLoading(true);

      try {
        const response = await fetch("/api/opinions/get_foryou_opinions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cursor_hot_score: cursorToUse?.hot_score ?? null,
            cursor_id: cursorToUse?.id ?? null,
            page_size: 50,
            user_preferences: [],
          }),
        });

        const data = await response.json();
        console.log(data);

        const mappedPosts: Post[] = data.posts.map((post: any) => ({
          id: post.id,
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
          poll: post.poll,
          createdAt: post.created_at,
        }));

        setPosts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const filteredNew = mappedPosts.filter((p) => !existingIds.has(p.id));
          console.log("Filtered new posts:", [...prev, ...filteredNew].length);
          return [...prev, ...filteredNew];
        });

        if (!data.pagination.hasMore) setHasMore(false);

        if (
          data.pagination?.nextCursor &&
          JSON.stringify(data.pagination.nextCursor) !== JSON.stringify(cursorToUse)
        ) {
          setCursor(data.pagination.nextCursor);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [hasMore]
  );

  // بدء التحميل عند كون posts فارغة (بعد حذف sessionStorage عند refresh)
  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts(null);
    }
  }, [fetchPosts, posts.length]);

  // Intersection Observer لتحميل المزيد
  useEffect(() => {
    if (!hasMore) return;

    const currentLoader = loaderRef.current;
    if (!currentLoader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingRef.current) {
          observer.unobserve(currentLoader);
          fetchPosts(cursor).then(() => {
            if (currentLoader) observer.observe(currentLoader);
          });
        }
      },
      { rootMargin: "400px", threshold: 0.1 }
    );

    observer.observe(currentLoader);

    return () => observer.disconnect();
  }, [hasMore, cursor, fetchPosts]);

  return (
    <div className="pb-12">
      <div className="max-w-2xl mx-auto space-y-6 scroll-smooth">
        {posts.map((post, index) => {
          const middleIndex = Math.floor(posts.length / 2);
          return (
            <React.Fragment key={post.id}>
              <PostComponent
                id={post.id}
                userInfo={post.userInfo}
                opinion={post.opinion}
                poll={post.poll}
                createdAt={post.createdAt}
              />
              {index === middleIndex && <div ref={loaderRef} style={{ height: "1px" }} />}
            </React.Fragment>
          );
        })}

        {loading && <PostSkeletonLoader />}
        {!hasMore && <p className="text-center">لا توجد منشورات أخرى.</p>}
      </div>
    </div>
  );
};

export default HomeContent;
