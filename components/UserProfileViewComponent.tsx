'use client';
import React from 'react';
import {
  FaVenus,
  FaMars,
  FaSchool,
  FaUniversity,
  FaUserGraduate,
  FaBook,
  FaGraduationCap
} from 'react-icons/fa';
import { UserEducation, UserInfo } from '../types/types';
import CustomIcon from '../components/postcomponents/CustomIcon';
import PureCSSLoader from './LoadingSpinner'
import Link from 'next/link';
import { BsPatchCheckFill } from 'react-icons/bs';
const UserProfileViewComponent: React.FC<{ userData?: UserInfo }> = ({ userData }) => {
  const genderThemes = {
    male: {
      text: 'text-blue-900',
      chipBg: 'bg-blue-100/80',
      chipText: 'text-blue-800',
      iconHex: '#2563EB',
      iconBg: '#EAF2FF',
      gradient: 'from-sky-400 via-blue-400 to-blue-600',
      svgColor: '#3B82F6'
    },
    female: {
      text: 'text-pink-900',
      chipBg: 'bg-pink-100/80',
      chipText: 'text-pink-800',
      iconHex: '#DB2777',
      iconBg: '#FDE2F2',
      gradient: 'from-pink-300 via-pink-400 to-fuchsia-500',
      svgColor: '#EC4899'
    }
  } as const;

  if (!userData) return <PureCSSLoader/>;

  const theme = genderThemes[userData.gender] || genderThemes.male;

  const customColor = userData.education.icon?.color || theme.iconHex;
  const customBg = userData.education.icon?.bgColor || theme.iconBg;
  const iconName =
    userData.education.icon?.component ||
    (userData.education.level === 'university' ? 'FaUniversity' : 'FaSchool');

      const isVerified = userData.id === 'stuvoice';
  return (
    <div className="relative w-full max-w-3xl mx-auto rtl text-right ">
      {/* خلفية عليا مزودة برسومات SVG */}
      <div className="absolute inset-x-0 top-0 h-60 overflow-hidden -z-10">
        <div className={`w-full h-full bg-gradient-to-r ${theme.gradient} rounded-[10px]`} />

        {/* موجة SVG شفافة */}
        <svg
          className="absolute bottom-0 left-0 w-full h-36"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,40 C360,100 1080,0 1440,80 L1440,120 L0,120 Z"
            fill="rgba(255, 255, 255, 0.56)"
          />
        </svg>

        {/* دوائر زخرفية */}
        <svg
          className="absolute top-8 left-10 w-40 h-40 opacity-20"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="80" fill={theme.svgColor} />
        </svg>
        <svg
          className="absolute top-20 right-16 w-32 h-32 opacity-10"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="80" fill={theme.svgColor} />
        </svg>
      </div>

      {/* محتوى الحساب */}
      <div className="px-4 py-12 pb-6 sm:py-10">
        <div className="flex items-center gap-6">
          {/* صورة شخصية أو أيقونة */}
          <div 
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden backdrop-blur-sm"
            style={{ backgroundColor: customBg }}
          >
            <CustomIcon icon={iconName} iconColor={customColor} bgColor={customBg} size={38} />
          </div>

          {/* الاسم + الجنس */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {userData.fullName}
            </h1>
            <div
              className={`inline-flex items-center mt-2 px-3 py-1 rounded-full ${theme.chipBg} ${theme.chipText} text-sm font-semibold`}
            >
            {isVerified ? (
              <>
              <BsPatchCheckFill className="text-green-500 mx-1" size={18} />
              <span>الحساب الرسمي</span>
              </>
            ) : userData.gender === 'male' ? (
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



        {/* قسم المعلومات التعليمية */}
        {isVerified?(<Link 
                    href="/STUvoice-profile" 
                    className="inline-flex items-center justify-center px-2 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                 قم بزيارة صفحة المنصة
                  </Link>
                ):(
                <section className="mt-12">
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
          )}

      </div>
    </div>
  );
};

// === المكونات الفرعية كما هي مع بعض اللمسات ===
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

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) => (
  <div className="flex items-center justify-between bg-white/80 backdrop-blur-md rounded-lg px-3 py-2 shadow-sm ring-1 ring-black/5 hover:shadow-md transition">
    <span className="flex items-center gap-2 text-gray-700 font-medium">
      {icon}
      <span>{label}</span>
    </span>
    <span className="font-semibold text-gray-900 truncate max-w-[60%]">
      {value && value.trim() !== '' ? value : 'غير محدد'}
    </span>
  </div>
);

const MiddleSchoolView = ({ education }: { education: UserEducation; theme: any }) => {
  const gradeMap: Record<string, string> = {
    first: 'السابع',
    second: 'الثامن',
    third: 'التاسع'
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

const HighSchoolView = ({ education }: { education: UserEducation; theme: any }) => {
  const gradeMap: Record<string, string> = {
    first: 'العاشر',
    second: 'الحادي عشر',
    third: 'البكلوريا'
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
      {/* <InfoRow
        icon={<FaUserGraduate className="text-gray-500" />}
        label="التخصص"
        value={education.track ? trackMap[education.track] || 'غير محدد' : 'غير محدد'}
      /> */}
      {education.degreeSeeking && (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-900 rounded-lg px-3 py-2 shadow-sm ring-1 ring-emerald-200">
          <FaGraduationCap className="text-emerald-600" />
          <span className="font-medium">في مرحلة استخراج شهادة الثانوية</span>
        </div>
      )}
    </>
  );
};

const UniversityView = ({ education }: { education: UserEducation; theme: any }) => {
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