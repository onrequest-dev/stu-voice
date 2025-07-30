import React from 'react';
import PostComponent from '../postcomponents/PostComponent';

const HomeContent = () => {
  const samplePosts = [
    {
      id: "post_1",
      userInfo: {
        id: "user_456",
        iconName: "university", // اسم الأيقونة الجديد
        iconColor: "#ffffff", // لون الأيقونة
        bgColor: "#3b82f6", // لون الخلفية (rgb(59, 130, 246) سابقاً)
        fullName: "يوسف زياد حيش",
        study: "هندسة معلوماتية"
      },
      opinion: {
        text: "نظام التعليم الإلكتروني في الجامعة يحتاج إلى تحسينات كبيرة في واجهة المستخدم واستقرار الخوادم",
        agreeCount: 24,
        disagreeCount: 5,
        readersCount: 128,
        commentsCount: 7
      },
      poll: {
        question: "ما رأيك في نظام التعليم الإلكتروني الحالي؟",
        options: ["ممتاز", "جيد", "مقبول", "ضعيف"],
        votes: [15, 35, 42, 28]
      }
    },
    {
      id: "post_2",
      userInfo: {
        id: "user_789",
        iconName: "stethoscope", // اسم الأيقونة الجديد
        iconColor: "#ffffff", // لون الأيقونة
        bgColor: "#dc3545", // لون الخلفية (rgb(220, 53, 69) سابقاً)
        fullName: "سارة أحمد",
        study: "طب بشري"
      },
      opinion: null,
      poll: {
        question: "كم مرة تزور المكتبة المركزية أسبوعياً؟",
        options: ["أقل من مرة", "1-2 مرات", "3-5 مرات", "أكثر من 5 مرات"],
        votes: [30, 45, 20, 5]
      }
    },
    {
      id: "post_3",
      userInfo: {
        id: "user_123",
        iconName: "calculator", // اسم الأيقونة الجديد
        iconColor: "#ffffff", // لون الأيقونة
        bgColor: "#28a745", // لون الخلفية (rgb(40, 167, 69) سابقاً)
        fullName: "محمد علي",
        study: "هندسة مدنية"
      },
      opinion: {
        text: "مواقف السيارات في الجامعة غير كافية وتسبب مشاكل كبيرة في الصباح",
        agreeCount: 87,
        disagreeCount: 12,
        readersCount: 342,
        commentsCount: 23
      },
      poll: null
    },
    // يمكنك إضافة المزيد من المنشورات هنا
  ];

  return (
    <div className="pb-12">
      <div className="max-w-2xl mx-auto space-y-6">
        {samplePosts.map((post) => (
          <PostComponent
            key={post.id}
            id={post.id}
            userInfo={post.userInfo}
            opinion={post.opinion}
            poll={post.poll}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeContent;