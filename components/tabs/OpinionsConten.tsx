// components/OpinionsContent.tsx
import ChatBoard from "../talk/ChatBoard";
import PostComponent from "../postcomponents/Posts/PostComponent";
const OpinionsContent = () => {
  const todayOpinion =
    "الحكمة ليست في معرفة الكثير، بل في تطبيق المعرفة بحكمة. الحياة رحلة تعلم مستمرة، وكل يوم فرصة جديدة لاكتشاف شيء جديد عن أنفسنا والعالم من حولنا.";

  // بيانات مستخدمين وهمية
  const user1 = {
    id: "u1",
    iconName: "userCircle",
    iconColor: "#1d4ed8",
    bgColor: "#dbeafe",
    fullName: "أحمد",
  };

  const user2 = {
    id: "u2",
    iconName: "userCircle",
    iconColor: "#16a34a",
    bgColor: "#dcfce7",
    fullName: "ليلى",
  };

  // لوحة دردشة افتراضية
  const demoBoard = {
    id: "board1",
    title: "نقاش اليوم",
    description: "لوحة دردشة تجريبية",
    messages: [
      {
        id: "m1",
        text: " rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrالسلام عليكم! 👋",
        time: "10:00",
        isMine: false,
        user: user1,
      },
      {
        id: "m2",
        text: "وعليكم السلام ورحمة الله 🌸",
        time: "10:02",
        isMine: true,
        user: user2,
      },
    ],
  };

    const post = {
  id: "post_54321",
  userInfo: {
    id: "user_98765",
    iconName: "academicCap",
    iconColor: "#10b981",
    bgColor: "#d1fae5",
    fullName: "سارة عبدالله",
    study: "خريجة علوم حاسوب من جامعة الأميرة نورة"
  },
  opinion: null,
  poll: {
    question: "ما هو أفضل إطار عمل جافاسكريبت من وجهة نظرك؟",
    options: ["React", "Vue", "Angular", "Svelte"], // مصفوفة نصوص وليس كائنات
    votes: [45, 30, 20, 15], // اختياري ولكن يجب أن يكون مصفوفة أعداد
    durationInDays: 14 // مطلوب حسب التعريف
  },
  createdAt: "2023-10-18T09:15:00Z"
};

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex-1">
        <ChatBoard
          post_id="123"
          board={demoBoard}
          postContent={
          <PostComponent
            id={post.id}
            userInfo={post.userInfo}
            opinion={post.opinion}
            poll={post.poll}
            createdAt={post.createdAt}
          />}/>;
      </div>
    </div>
  );
};

export default OpinionsContent;
