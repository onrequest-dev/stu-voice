'use client';
import React from 'react';
import { FaVenus, FaMars, FaSchool, FaUniversity, FaUserGraduate, FaBook, FaGraduationCap } from 'react-icons/fa';
import { UserEducation, UserInfo } from '../types/types';
import CustomIcon from '../components/postcomponents/CustomIcon';
import LoadingSpinner from './LoadingSpinner';

const UserProfileViewComponent: React.FC<{ userData?: UserInfo }> = ({ userData }) => {
  // ثيمات محسّنة للألوان
  const genderThemes = {
    male: {
      primary: 'from-sky-400 to-blue-500',
      text: 'text-blue-900',
      chipBg: 'bg-blue-100/80',
      chipText: 'text-blue-800',
      iconHex: '#2563EB',
      iconBg: '#EAF2FF'
    },
    female: {
      primary: 'from-fuchsia-400 to-pink-500',
      text: 'text-fuchsia-900',
      chipBg: 'bg-pink-100/80',
      chipText: 'text-fuchsia-800',
      iconHex: '#DB2777',
      iconBg: '#FDE2F2'
    }
  } as const;

  if (!userData) return <LoadingSpinner />;

  const theme = genderThemes[userData.gender] || genderThemes.male;

  const customColor = userData.education.icon?.color || theme.iconHex;
  const customBg = userData.education.icon?.bgColor || theme.iconBg;
  const iconName =
    userData.education.icon?.component ||
    (userData.education.level === 'university' ? 'FaUniversity' : 'FaSchool');

  return (
    <div className="w-full max-w-4xl mx-auto rtl text-right">
      {/* هيدر ممتد بموجات SVG */}
      <div className="relative">
        {/* خلفية متدرجة */}
        <div className={`w-full h-36 sm:h-44 bg-gradient-to-r ${theme.primary}`} />

        {/* موجة علوية فاتحة */}
<svg
  className="absolute top-10 left-10 w-full"
  viewBox="0 0 1440 120"
  preserveAspectRatio="none"
  aria-hidden="true"
>
  <path
    d="M0,0 C300,60 480,-10 720,40 C960,90 1140,20 1440,50 L1440,0 Z"
    fill="rgba(255, 255, 255, 0.85)"
  />
</svg>

{/* موجة ظل خفيفة */}
<svg
  className="absolute top-20 left-0 w-full"
  viewBox="0 0 1440 120"
  preserveAspectRatio="none"
  aria-hidden="true"
>
  <path
    d="M0,10 C280,70 460,0 720,60 C980,110 1200,30 1440,70 L1440,0 Z"
    fill="rgba(178, 252, 164, 0.85)"
  />
</svg>

        {/* شارة الأيقونة الدائرية على يمين الهيدر */}
        <div className="absolute right-4 sm:right-6 top-10 sm:top-7">
          <div
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-4 border-white shadow-xl flex items-center justify-center"
            style={{ backgroundColor: customBg }}
          >
            <CustomIcon icon={iconName} iconColor={customColor} bgColor={customBg} size={22} />
          </div>
        </div>
      </div>

      {/* محتوى بطاقة الزيارة بدون إطار، محاذى يميناً */}
      <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-10">
        {/* الاسم + شارة النوع */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1" />
          <div className="text-right">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {userData.fullName}
            </h1>
            <div
              className={`inline-flex items-center mt-2 px-3 py-1 rounded-full ${theme.chipBg} ${theme.chipText} text-sm font-semibold`}
            >
              {userData.gender === 'male' ? (
                <>
                  <FaMars className="ms-1 me-2" />
                  <span>ذكر</span>
                </>
              ) : (
                <>
                  <FaVenus className="ms-1 me-2" />
                  <span>أنثى</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* معلومات تعليمية أنيقة على شكل بطاقات خفيفة بدون إطار خارجي */}
        <section className="mt-6 sm:mt-8">
          <HeaderTitle education={userData.education} theme={theme} />

          <div className="mt-4 grid grid-cols-1 gap-3">
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
        </section>
      </div>
    </div>
  );
};

// عنوان القسم مع شارة مرحلة
const HeaderTitle = ({ education, theme }: { education: UserEducation; theme: any }) => {
  const title =
    education.level === 'university' ? 'المعلومات الأكاديمية' : 'المعلومات الدراسية';
  const levelLabel =
    education.level === 'middle' ? 'إعدادي' : education.level === 'high' ? 'ثانوي' : 'جامعي';

  const IconComp = education.level === 'university' ? FaUniversity : FaSchool;

  return (
    <div className="flex items-center justify-between">
      <h2 className={`flex items-center gap-2 text-lg sm:text-xl font-bold ${theme.text}`}>
        <IconComp className="text-base sm:text-lg opacity-90" />
        <span>{title}</span>
      </h2>
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 text-gray-800 text-sm font-semibold">
        {levelLabel}
      </span>
    </div>
  );
};

// عناصر صف واحد أنيقة
const InfoRow = ({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) => (
  <div className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm ring-1 ring-black/5">
    <span className="flex items-center gap-2 text-gray-700 font-medium">
      {icon}
      <span>{label}</span>
    </span>
    <span className="font-semibold text-gray-900 truncate max-w-[60%]">
      {value && value.trim() !== '' ? value : 'غير محدد'}
    </span>
  </div>
);

// المراحل
const MiddleSchoolView = ({ education, theme }: { education: UserEducation; theme: any }) => {
  const gradeMap: Record<string, string> = {
    first: 'الصف السابع',
    second: 'الصف الثامن',
    third: 'الصف التاسع'
  };
  return (
    <>
      <InfoRow
        icon={<FaBook className="text-gray-500" />}
        label="الصف الدراسي"
        value={education.grade ? gradeMap[education.grade] || 'غير محدد' : 'غير محدد'}
      />

      {education.degreeSeeking && (
        <div className="flex items-center gap-2 bg-amber-50 text-amber-900 rounded-lg px-3 py-2 shadow-sm ring-1 ring-amber-200">
          <FaGraduationCap className="text-amber-600" />
          <span className="font-medium">في مرحلة استخراج شهادة الإعدادية</span>
        </div>
      )}
    </>
  );
};

const HighSchoolView = ({ education, theme }: { education: UserEducation; theme: any }) => {
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
      <InfoRow
        icon={<FaBook className="text-gray-500" />}
        label="الصف الدراسي"
        value={education.grade ? gradeMap[education.grade] || 'غير محدد' : 'غير محدد'}
      />
      <InfoRow
        icon={<FaUserGraduate className="text-gray-500" />}
        label="التخصص"
        value={education.track ? trackMap[education.track] || 'غير محدد' : 'غير محدد'}
      />

      {education.degreeSeeking && (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-900 rounded-lg px-3 py-2 shadow-sm ring-1 ring-emerald-200">
          <FaGraduationCap className="text-emerald-600" />
          <span className="font-medium">في مرحلة استخراج شهادة الثانوية</span>
        </div>
      )}
    </>
  );
};

const UniversityView = ({ education, theme }: { education: UserEducation; theme: any }) => {
  const yearMap: Record<string, string> = {
    first: 'السنة الأولى',
    second: 'السنة الثانية',
    third: 'السنة الثالثة',
    fourth: 'السنة الرابعة',
    fifth: 'السنة الخامسة',
    graduate: 'خريج'
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      <InfoRow icon={<FaUniversity className="text-gray-500" />} label="الجامعة" value={education.university} />
      <InfoRow icon={<FaBook className="text-gray-500" />} label="الكلية" value={education.faculty} />
      <InfoRow icon={<FaUserGraduate className="text-gray-500" />} label="التخصص" value={education.specialization} />
      <InfoRow
        icon={<FaGraduationCap className="text-gray-500" />}
        label="السنة"
        value={education.year ? yearMap[education.year] || 'غير محدد' : 'غير محدد'}
      />
    </div>
  );
};

export default UserProfileViewComponent;