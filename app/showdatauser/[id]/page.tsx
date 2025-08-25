// app/showdatauser/[id]/page.tsx
'use client';
import UserProfileViewComponent from '../../../components/UserProfileViewComponent';
import { UserInfo } from '../../../types/types';

// بيانات افتراضية
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
  description:"إن الطريق إلى الحقيقة يمر من القلب لا من الرأس فاجعل قلبك لا عقلك دليلك الرئيسي واجه، تحد، وتغلب في نهاية المطاف على النفس بقلبك، إن معرفتك بنفسك ستقودك إلى معرفة الله. حياتك حافلة، مليئة، كاملة، أو هكذا يخيل إليك، حتى يظهر فيها شخص يجعلك تدرك ما كنت تفتقده طوال هذا الوقت.",
};

export default function UserProfilePage() {
  return (
    <div className="container mx-auto mt-2">
      <UserProfileViewComponent userData={mockUserData} />
    </div>
  );
}