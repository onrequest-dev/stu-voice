import React from 'react';
import PostComponent from '../PostComponent';
import { FaArrowUp, FaArrowDown, FaEye, FaUserGraduate, FaInfoCircle } from 'react-icons/fa';

const HomeContent = () => {
 const samplePosts = [
  {
    userInfo: {
      id: "user_456",
      iconColor: [59, 130, 246] as [number, number, number],
      fullName: "يوسف زياد حيش",
      study: "هندسة معلوماتية"
    },
    opinion: {
      text: "نظام التعليم الإلكتروني في الجامعة يحتاج إلى تحسينات كبيرة في واجهة المستخدم واستقرار الخوادم",
      agreeCount: 24,
      disagreeCount: 5,
      readersCount: 128
    },
    poll: {
      question: "ما رأيك في نظام التعليم الإلكتروني الحالي؟",
      options: ["ممتاز", "جيد", "مقبول", "ضعيف"]
    }
  },
  {
    userInfo: {
      id: "user_789",
      iconColor: [220, 53, 69] as [number, number, number],
      fullName: "سارة أحمد",
      study: "طب بشري"
    },
    opinion: {
      text: "المكتبة المركزية تحتاج إلى تحديث الكتب وتوفير نسخ إلكترونية من المراجع الأساسية",
      agreeCount: 42,
      disagreeCount: 3,
      readersCount: 215
    },
    poll: {
      question: "كم مرة تزور المكتبة المركزية أسبوعياً؟",
      options: ["أقل من مرة", "1-2 مرات", "3-5 مرات", "أكثر من 5 مرات"]
    }
  },
  {
    userInfo: {
      id: "user_123",
      iconColor: [40, 167, 69] as [number, number, number],
      fullName: "محمد علي",
      study: "هندسة مدنية"
    },
    opinion: {
      text: "مواقف السيارات في الجامعة غير كافية وتسبب مشاكل كبيرة في الصباح",
      agreeCount: 87,
      disagreeCount: 12,
      readersCount: 342
    },
    poll: {
      question: "ما هو الحل الأمثل لمشكلة مواقف السيارات؟",
      options: ["بناء مواقف متعددة الطوابق", "تنظيم مواعيد المحاضرات", "تشجيع استخدام المواصلات العامة", "فرض رسوم على المواقف"]
    }
  },
  {
    userInfo: {
      id: "user_321",
      iconColor: [255, 193, 7] as [number, number, number],
      fullName: "نورا عبدالله",
      study: "إدارة أعمال"
    },
    opinion: {
      text: "المقصف الجامعي يحتاج إلى تحسين جودة الطعام وتنوع الوجبات الصحية",
      agreeCount: 56,
      disagreeCount: 8,
      readersCount: 189
    },
    poll: {
      question: "ما هي الوجبات التي تفضل توفرها في المقصف؟",
      options: ["وجبات سريعة", "وجبات صحية", "سندويشات خفيفة", "مشروبات وعصائر طازجة"]
    }
  },
  {
    userInfo: {
      id: "user_654",
      iconColor: [111, 66, 193] as [number, number, number],
      fullName: "خالد سامي",
      study: "علوم حاسوب"
    },
    opinion: {
      text: "المختبرات الحاسوبية تحتاج إلى تحديث الأجهزة وتركيب برامج حديثة",
      agreeCount: 63,
      disagreeCount: 5,
      readersCount: 231
    },
    poll: {
      question: "ما هي أهم البرامج التي تحتاجها في المختبرات؟",
      options: ["برامج التصميم", "بيئات التطوير", "قواعد البيانات", "برامج المحاكاة"]
    }
  }
];

  return (
    <div className="pb-12">
      <div className="max-w-2xl mx-auto space-y-6">
        {samplePosts.map((post, index) => (
          <PostComponent
            key={index}
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