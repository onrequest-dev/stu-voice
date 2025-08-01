import DailyOpinion from "../DailyOpinion";

const OpinionsContent = () => {
  const opinion = {
    id: '1',
    type: 'أكاديمي' as const,
    text: 'ما رأيكم في إضافة المزيد من المساقات العملية في الخطة الدراسية؟',
    agreeCount: 124,
    disagreeCount: 32,
    readersCount: 568
  };

  const initialComments = [
    {
      id: '1',
      text: 'أعتقد أن هذه فكرة ممتازة لتطوير مهارات الطلاب العملية',
      likes: 5,
      timestamp: 'منذ ساعة',
      userInfo: {
        id: 'user-456',
        fullName: 'سارة علي',
        iconName: 'user-graduate',
        iconColor: '#ffffff',
        bgColor: '#10b981',
        study: 'student'
      }
    },
    {
      id: '2',
      text: 'أنا مع الرأي ولكن يجب أن تكون المساقات اختيارية وليست إجبارية',
      likes: 2,
      timestamp: 'منذ ٣٠ دقيقة',
      userInfo: {
        id: 'user-789',
        fullName: 'خالد عبدالله',
        iconName: 'user-tie',
        iconColor: '#ffffff',
        bgColor: '#6366f1',
        study: 'professor'
      }
    }
  ];

  return (
    <DailyOpinion opinion={opinion} initialComments={initialComments} />
  );
};

export default OpinionsContent;