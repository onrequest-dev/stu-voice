'use client';
import React from 'react';
import { FaVenus, FaMars, FaSchool, FaUniversity, FaUserGraduate, FaIdCard, FaBook, FaGraduationCap } from 'react-icons/fa';
import { UserEducation, UserInfo } from '../types/types';
import CustomIcon from '../components/postcomponents/CustomIcon';
import LoadingSpinner from './LoadingSpinner';

const UserProfileViewComponent: React.FC<{ userData?: UserInfo }> = ({ userData }) => {
  // أنظمة الألوان المحسنة
  const genderThemes = {
    male: {
      primary: 'bg-gradient-to-r from-blue-600 to-blue-700',
      secondary: 'bg-blue-50',
      accent: 'bg-blue-100/80',
      text: 'text-blue-800',
      iconColor: 'text-blue-600'
    },
    female: {
      primary: 'bg-gradient-to-r from-purple-600 to-pink-600',
      secondary: 'bg-purple-50',
      accent: 'bg-pink-100/80',
      text: 'text-purple-800',
      iconColor: 'text-pink-600'
    }
  } as const;

  // إذا لم تكن البيانات متوفرة، عرض رسالة تحميل
  if (!userData) {
    return <LoadingSpinner/> ;
  }

  // الحصول على الثيم مع قيمة افتراضية
  const theme = genderThemes[userData.gender] || genderThemes.male;

  // تأثيرات التصميم المعدلة
  const cardStyle = 'rounded-none sm:rounded-xl shadow-md overflow-visible w-full';
  const sectionStyle = 'rounded-lg bg-white border border-gray-100';

  // دالة لاستعادة أيقونة محسنة باستخدام CustomIcon
  const renderProfileIcon = () => {
    const customColor = userData.education.icon?.color || (userData.gender === 'male' ? '#2563EB' : '#DB2777');
    const customBg = userData.education.icon?.bgColor || (userData.gender === 'male' ? '#EFF6FF' : '#FCE7F3');
    const iconName = userData.education.icon?.component || 
                    (userData.education.level === 'university' ? 'FaUniversity' : 'FaSchool');

    return (
      <div 
        className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center absolute -top-8 md:-top-10 left-1/2 transform -translate-x-1/2 border-4 border-white shadow-lg z-10"
        style={{ 
          backgroundColor: customBg,
        }}
      >
        <CustomIcon 
          icon={iconName} 
          iconColor={customColor} 
          bgColor={customBg}
          size={20}
        />
      </div>
    );
  };

  return (
    <div className="relative w-full px-0 sm:px-4 md:px-6 pt-0 md:pt-12 max-w-md mx-auto text-right">
      {/* بطاقة المستخدم المعدلة */}
      <div className={`${theme.secondary} ${cardStyle}`}>
        {/* شريط العنوان المتدرج */}
        <div className={`${theme.primary} h-3 md:h-4 w-full`}></div>
        
        <div className="p-3 md:p-4 relative">
          {/* رأس البطاقة المعدل */}
          <div className="flex flex-col items-center pt-6 md:pt-8 pb-2 md:pb-3">
            {renderProfileIcon()}
            
            <h1 className="mt-6 md:mt-8 text-lg md:text-xl font-bold text-gray-900 text-center px-1 md:px-2">
              {userData.fullName}
            </h1>
            
            <div className={`flex items-center mt-1 md:mt-2 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full ${theme.accent} ${theme.text} text-xs md:text-sm font-medium`}>
              {userData.gender === 'male' ? (
                <>
                  <FaMars className="mr-2 md:mr-1 text-xs md:text-sm" />
                  <span>ذكر</span>
                </>
              ) : (
                <>
                  <FaVenus className="mr-2 md:mr-1 text-xs md:text-sm" />
                  <span>أنثى</span>
                </>
              )}
            </div>
          </div>

          {/* قسم المعلومات التعليمية المعدل */}
          <div className={`${sectionStyle} p-2 md:p-3 mb-0 md:mb-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 md:mb-3">
              <h2 className={`text-sm md:text-base font-semibold ${theme.text} flex items-center mb-0.5 sm:mb-0`}>
                {userData.education.level === 'university' ? (
                  <>
                    <FaUniversity className={`mr-2 ${theme.iconColor} text-sm md:text-base`} />
                    <span>المعلومات الأكاديمية</span>
                  </>
                ) : (
                  <>
                    <FaSchool className={`mr-1 ${theme.iconColor} text-sm md:text-base`} />
                    <span>المعلومات الدراسية</span>
                  </>
                )}
              </h2>
              <span className={`px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-xs md:text-sm font-semibold ${theme.primary} text-white self-start sm:self-auto`}>
                {userData.education.level === 'middle' && 'إعدادي'}
                {userData.education.level === 'high' && 'ثانوي'}
                {userData.education.level === 'university' && 'جامعي'}
              </span>
            </div>

            {/* محتوى حسب المرحلة التعليمية */}
            <div className="space-y-1.5 md:space-y-2">
              {userData.education.level === 'middle' && (
                <MiddleSchoolView education={userData.education} theme={theme} />
              )}

              {userData.education.level === 'high' && (
                <HighSchoolView education={userData.education} theme={theme} />
              )}

              {userData.education.level === 'university' && (
                <UniversityView education={userData.education} theme={theme} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// مكونات العرض الفرعية
const MiddleSchoolView = ({ education, theme }: { education: UserEducation, theme: any }) => {
  const gradeMap: Record<string, string> = {
    first: 'الصف السابع',
    second: 'الصف الثامن',
    third: 'الصف التاسع'
  };

  return (
    <>
      <div className="flex justify-between items-center p-1.5 md:p-2 rounded bg-gray-50 text-xs md:text-sm">
        <span className={`font-medium ${theme.text} flex items-center`}>
          <FaBook className={`mr-2 md:mr-1 ${theme.iconColor} text-xs md:text-sm`} />
          <span>الصف الدراسي</span>
        </span>
        <span className="font-semibold text-gray-700 truncate max-w-[50%]">
          {education.grade ? gradeMap[education.grade] || 'غير محدد' : 'غير محدد'}
        </span>
      </div>

      {education.degreeSeeking && (
        <div className={`p-1.5 md:p-2 rounded ${theme.accent} flex items-center text-2xs md:text-xs mt-0.5 md:mt-1`}>
          <FaGraduationCap className={`mr-2 md:mr-1 ${theme.iconColor} text-xs md:text-sm`} />
          <span className={`${theme.text} font-medium`}>في مرحلة استخراج شهادة الإعدادية</span>
        </div>
      )}
    </>
  );
};

const HighSchoolView = ({ education, theme }: { education: UserEducation, theme: any }) => {
  const gradeMap: Record<string, string> = {
    first: 'الصف العاشر',
    second: 'الصف الحادي عشر',
    third: 'صف البكلوريا'
  };

  const trackMap: Record<string, string> = {
    scientific: 'علمي',
    literary: 'أدبي',
    vocational: 'مهني'
  };

  return (
    <>
      <div className="flex justify-between items-center p-1.5 md:p-2 rounded bg-gray-50 text-xs md:text-sm">
        <span className={`font-medium ${theme.text} flex items-center`}>
          <FaBook className={`mr-2 md:mr-1 ${theme.iconColor} text-xs md:text-sm`} />
          <span>الصف الدراسي</span>
        </span>
        <span className="font-semibold text-gray-700 truncate max-w-[50%]">
          {education.grade ? gradeMap[education.grade] || 'غير محدد' : 'غير محدد'}
        </span>
      </div>

      <div className="flex justify-between items-center p-1.5 md:p-2 rounded bg-gray-50 text-xs md:text-sm mt-0.5 md:mt-1">
        <span className={`font-medium ${theme.text} flex items-center`}>
          <FaUserGraduate className={`mr-2 md:mr-1 ${theme.iconColor} text-xs md:text-sm`} />
          <span>التخصص</span>
        </span>
        <span className="font-semibold text-gray-700 truncate max-w-[50%]">
          {education.track ? trackMap[education.track] || 'غير محدد' : 'غير محدد'}
        </span>
      </div>

      {education.degreeSeeking && (
        <div className={`p-1.5 md:p-2 rounded ${theme.accent} flex items-center text-2xs md:text-xs mt-0.5 md:mt-1`}>
          <FaGraduationCap className={`mr-2 md:mr-1 ${theme.iconColor} text-xs md:text-sm`} />
          <span className={`${theme.text} font-medium`}>في مرحلة استخراج شهادة الثانوية</span>
        </div>
      )}
    </>
  );
};

const UniversityView = ({ education, theme }: { education: UserEducation, theme: any }) => {
  const yearMap: Record<string, string> = {
    first: 'السنة الأولى',
    second: 'السنة الثانية',
    third: 'السنة الثالثة',
    fourth: 'السنة الرابعة',
    fifth: 'السنة الخامسة',
    graduate: 'خريج'
  };

  return (
    <div className="grid grid-cols-1 gap-1 md:gap-1.5">
      <div className="flex justify-between items-center p-1.5 md:p-2 rounded bg-gray-50 text-xs md:text-sm">
        <span className={`font-medium ${theme.text} flex items-center`}>
          <FaUniversity className={`mr-2 md:mr-1 ${theme.iconColor} text-xs md:text-sm`} />
          <span>الجامعة</span>
        </span>
        <span className="font-semibold text-gray-700 truncate max-w-[50%]">
          {education.university || 'غير محدد'}
        </span>
      </div>

      <div className="flex justify-between items-center p-1.5 md:p-2 rounded bg-gray-50 text-xs md:text-sm">
        <span className={`font-medium ${theme.text} flex items-center`}>
          <FaBook className={`mr-2 md:mr-1 ${theme.iconColor} text-xs md:text-sm`} />
          <span>الكلية</span>
        </span>
        <span className="font-semibold text-gray-700 truncate max-w-[50%]">
          {education.faculty || 'غير محدد'}
        </span>
      </div>

      <div className="flex justify-between items-center p-1.5 md:p-2 rounded bg-gray-50 text-xs md:text-sm">
        <span className={`font-medium ${theme.text} flex items-center`}>
          <FaUserGraduate className={`mr-2 md:mr-1 ${theme.iconColor} text-xs md:text-sm`} />
          <span>التخصص</span>
        </span>
        <span className="font-semibold text-gray-700 truncate max-w-[50%]">
          {education.specialization || 'غير محدد'}
        </span>
      </div>

      <div className="flex justify-between items-center p-1.5 md:p-2 rounded bg-gray-50 text-xs md:text-sm">
        <span className={`font-medium ${theme.text} flex items-center`}>
          <FaGraduationCap className={`mr-2 md:mr-1 ${theme.iconColor} text-xs md:text-sm`} />
          <span>السنة</span>
        </span>
        <span className="font-semibold text-gray-700 truncate max-w-[50%]">
          {education.year ? yearMap[education.year] || 'غير محدد' : 'غير محدد'}
        </span>
      </div>
    </div>
  );
};

export default UserProfileViewComponent;