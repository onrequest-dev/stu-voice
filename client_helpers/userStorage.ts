import { UserInfo as PostUserInfo } from '../components/postcomponents/types';
import { UserInfo as MainUserInfo, UserEducation } from '../types/types';

/**
 * يحصل على بيانات المستخدم من LocalStorage ويحولها للنوع المطلوب.
 * @returns {PostUserInfo | null} بيانات المستخدم المحولة أو null إذا لم توجد أو حدث خطأ.
 */
export const getUserDataFromStorage = (): PostUserInfo | null => {
  try {
    const storedData = localStorage.getItem('userInfo');
    if (!storedData) return null;

    const parsedData = JSON.parse(storedData) as MainUserInfo;
    
    // تحويل البيانات من النوع الأول إلى النوع الثاني
    return transformUserInfo(parsedData);
  } catch (error) {
    console.error('فشل قراءة بيانات المستخدم من التخزين:', error);
    return null;
  }
};

// دالة مساعدة للتحويل بين نوعي بيانات المستخدم
const transformUserInfo = (userInfo: MainUserInfo): PostUserInfo => {
  const education = userInfo.education;
  
  return {
    id: userInfo.id ,
    fullName: userInfo.fullName,
    iconName: education?.icon?.component || getInitialLetter(userInfo.fullName),
    iconColor: education?.icon?.color || '#4CAF50',
    bgColor: education?.icon?.bgColor || '#F5F5F5',
    study: getStudyInfo(education)
  };
};

// دالة مساعدة للحصول على الحرف الأول من الاسم
const getInitialLetter = (name?: string): string => {
  if (!name) return 'U';
  return name.charAt(0);
};

// دالة مساعدة لإنشاء نص الدراسة
const getStudyInfo = (education?: UserEducation): string => {
  if (!education) return '';
  
  if (education.level === 'university') {
    return `${education.faculty || ''} - ${education.university || ''}`.trim();
  }
  
  return education.level === 'middle' ? 'تعليم أساسي' : 
         education.level === 'high' ? 'تعليم ثانوي' : '';
};