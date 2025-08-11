// app/showdatauser/[id]/page.tsx
'use client';
import UserProfileViewComponent from '../../../components/UserProfileViewComponent';
import { UserInfo } from '../../../types/types';

// بيانات افتراضية
const mockUserData: UserInfo = {
  id: '1',
  fullName: 'أحمد محمد',
  gender: 'male',
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
  }
};

export default function UserProfilePage() {
  return (
    <div className="container mx-auto p-4">
      <UserProfileViewComponent userData={mockUserData} />
    </div>
  );
}