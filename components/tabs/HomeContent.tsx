import React from 'react';
import PostComponent from '../postcomponents/PostComponent';

const HomeContent = () => {
const samplePosts = [
  {
    id: "post_1",
    userInfo: {
      id: "user_456",
      iconName: "university",
      iconColor: "#ffffff",
      bgColor: "#3b82f6",
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
      votes: [15, 35, 42, 28],
      durationInDays:7,
    }
  },
  {
    id: "post_2",
    userInfo: {
      id: "user_789",
      iconName: "stethoscope",
      iconColor: "#ffffff",
      bgColor: "#dc3545",
      fullName: "سارة أحمد",
      study: "طب بشري"
    },
    opinion: null,
    poll: {
      question: "كم مرة تزور المكتبة المركزية أسبوعياً؟",
      options: ["أقل من مرة", "1-2 مرات", "3-5 مرات", "أكثر من 5 مرات"],
      votes: [30, 45, 20, 5],
      durationInDays:-1, 
    }
  },
  // ... باقي المنشورات
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