'use client';
import UserProfileViewComponent from '../../../components/UserProfileViewComponent';
import PostComponent from '@/components/postcomponents/Posts/PostComponent';
import { UserInfo } from '../../../types/types';
import { PostProps } from '@/components/postcomponents/types';
// بيانات افتراضية للمستخدم
const mockUserData: UserInfo = {
  id: '1',
  fullName: 'يوسف زياد حيش',
  gender: 'female',
  education: {
    level: 'university',
    university: 'جامعة القاهرة',
    faculty: 'كلية الهندسة',
    specialization: 'هندسة البرمجيات',
    year: 'third',
    studentId: '20201111',
    icon: {
      component: 'FaUserGraduate',
      color: '#2563EB',
      bgColor: '#EFF6FF'
    }
  },
  description: "إن الطريق إلى الحقيقة يمر من القلب لا من الرأس فاجعل قلبك لا عقلك دليلك الرئيسي واجه، تحد، وتغلب في نهاية المطاف على النفس بقلبك، إن معرفتك بنفسك ستقودك إلى معرفة الله. حياتك حافلة، مليئة، كاملة، أو هكذا يخيل إليك، حتى يظهر فيها شخص يجعلك تدرك ما كنت تفتقده طوال هذا الوقت.",
};

// بيانات افتراضية للمنشورات
const mockPosts: PostProps[] = [
  {
    id: 'post1',
    userInfo: {
      id: '1',
      iconName: 'FaUser',
      iconColor: '#ffffff',
      bgColor: '#3B82F6',
      fullName: 'يوسف زياد حيش',
      study: 'هندسة البرمجيات',
      disableLinks: true
    },
    opinion: {
      text: 'أعتقد أن تطوير مهارات البرمجة أمر ضروري لكل طالب في مجال الهندسة، حيث يساعد ذلك في فتح آفاق جديدة للعمل والابتكار.',
      agreeCount: 24,
      disagreeCount: 3,
      readersCount: 156,
      commentsCount: 8
    },
    poll: null,
    createdAt: '2023-10-15T14:30:00Z',
    showDiscussIcon: true
  },
  {
    id: 'post2',
    userInfo: {
      id: '1',
      iconName: 'FaUser',
      iconColor: '#ffffff',
      bgColor: '#3B82F6',
      fullName: 'يوسف زياد حيش',
      study: 'هندسة البرمجيات',
      disableLinks: true
    },
    opinion: null,
    poll: {
      question: 'ما هو أفضل نظام تشغيل للمطورين؟',
      options: ['Windows', 'macOS', 'Linux', 'أخرى'],
      votes: [45, 78, 120, 15],
      durationInDays: 7
    },
    createdAt: '2023-10-10T09:15:00Z',
    showDiscussIcon: false
  },
  {
    id: 'post3',
    userInfo: {
      id: '1',
      iconName: 'FaUser',
      iconColor: '#ffffff',
      bgColor: '#3B82F6',
      fullName: 'يوسف زياد حيش',
      study: 'هندسة البرمجيات',
      disableLinks: true
    },
    opinion: {
      text: 'التعليم عن بعد أصبح خيارًا ضروريًا في عصرنا الحالي، لكنه يحتاج إلى تطوير البنية التحتية التقنية لضمان جودة التعلم.',
      agreeCount: 67,
      disagreeCount: 12,
      readersCount: 289,
      commentsCount: 23
    },
    poll: null,
    createdAt: '2023-10-05T16:45:00Z',
    showDiscussIcon: true
  }
];

export default function UserProfilePage() {
  return (
    <div className="container mx-auto my-2 px-1">
      <UserProfileViewComponent userData={mockUserData} />
      
      {/* قسم المنشورات */}
      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-bold text-right mb-4">منشورات يوسف</h2>
        
        <div className="space-y-4">
          {mockPosts.map((post) => (
            <PostComponent 
              key={post.id}
              id={post.id}
              userInfo={post.userInfo}
              opinion={post.opinion}
              poll={post.poll}
              createdAt={post.createdAt}
              showDiscussIcon={post.showDiscussIcon}
            />
          ))}
        </div>
        
        {mockPosts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>لا توجد منشورات حتى الآن</p>
          </div>
        )}
      </div>
    </div>
  );
}