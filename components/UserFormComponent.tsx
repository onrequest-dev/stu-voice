'use client';
import React, { useState, useEffect } from 'react';
import {  FaVenus, FaMars,  FaSchool, FaUniversity, FaCheck } from 'react-icons/fa';
import {   UserEducation, UserInfo } from '../types/types';
import IconPicker from './IconPicker';
const UserFormComponent: React.FC<{
  onSubmit: (data: UserInfo) => void;
  initialData?: UserInfo;
}> = ({ onSubmit, initialData }) => {
const [formData, setFormData] = useState<UserInfo>(
  initialData || {
    id: '',
    fullName: '',
    gender: 'male',
    education: {
      level: 'middle',
      icon: { 
        component: 'graduation', 
        color: '#4a5568', 
        bgColor: '#ffffff' 
      }
    }
  }
);

  useEffect(() => {
  if (!initialData) {
    const storedData = localStorage.getItem('userInfo');
    if (storedData) {
      try {
        const parsed: UserInfo = JSON.parse(storedData);
        setFormData(parsed);
      } catch (err) {
      }
    }
  }
}, [initialData]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (field: keyof UserInfo, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

const handleEducationChange = (field: keyof UserEducation, value: any) => {
  setFormData(prev => ({
    ...prev,
    education: {
      ...prev.education,
      [field]: value
    }
  }));
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitSuccess(false); // إعادة تعيين حالة النجاح
  
  try {
    await onSubmit(formData);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 2000);
  } catch (error) {
    // لا نقوم بتعيين submitSuccess على true هنا
  } finally {
    setIsSubmitting(false);
  }
};

  const genderClasses = {
    male: {
      bgPrimary: 'bg-blue-500',
      bgSecondary: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-300',
      focusRing: 'focus:ring-blue-500'
    },
    female: {
      bgPrimary: 'bg-pink-500',
      bgSecondary: 'bg-pink-100',
      text: 'text-pink-800',
      border: 'border-pink-300',
      focusRing: 'focus:ring-pink-500'
    }
  };
const handleIconChange = (iconName: string, color: string, bgColor: string) => {
  handleEducationChange("icon", {
    component: iconName,
    color,
    bgColor
  });
};
  const [iconData, setIconData] = useState({
    icon: 'graduation',
    color: '#4a5568',
    bgColor: '#ffffff'
  });
  const currentGender = genderClasses[formData.gender];

  return (
    <div className="relative text-right">
        <div className={`max-w-2xl mx-auto p-4 md:p-6 rounded-lg shadow-lg transition-all duration-300 ${currentGender.bgSecondary} border ${currentGender.border} mt-12`}>
            {/* تغليف الأيقونة - تم تعديل الموضع هنا */}
            <div className="mx-auto -mt-16 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white">
            <IconPicker
              onIconChange={handleIconChange}
              initialIcon={formData.education.icon?.component || 'graduation'}
              initialColor={formData.education.icon?.color || '#4a5568'}
              initialBgColor={formData.education.icon?.bgColor || '#ffffff'}
            />
            </div>
        <form onSubmit={handleSubmit}>
          {/* الاسم الكامل */}

        <div style={{
          background: 'transparent',
          color: '#555',
          padding: '0.4rem 1rem',
          borderRadius: '4px',
          marginBottom: '1.5rem',
          overflow: 'hidden',
          position: 'relative',
          fontFamily: 'inherit',
        }} className='mt-2'>
          <div style={{
            animation: 'marqueeLeftToRight 20s linear infinite',
            whiteSpace: 'nowrap',
            fontSize: '0.8rem',
            fontWeight: '300',
            display: 'inline-block'
          }}>
            {/* تكرار المحتوى مرتين لضمان الاستمرارية */}
            <span style={{ margin: '0 0.8rem', opacity: '0.6' }}>•</span>
            <span>تنبيه: يمكن تعديل البيانات مرة واحدة فقط كل أسبوع - يرجى التحقق من المعلومات قبل الحفظ</span>
            <span style={{ margin: '0 0.8rem', opacity: '0.6' }}>•</span>
            <span>لن تتمكن من التعديل مرة أخرى حتى مرور 7 أيام على آخر تعديل</span>
            <span style={{ margin: '0 0.8rem', opacity: '0.6' }}>•</span>
            <span>تأكد من صحة المعلومات المدخلة قبل حفظ التعديلات</span>
            
            {/* تكرار المحتوى مرة أخرى */}
            <span style={{ margin: '0 0.8rem', opacity: '0.6' }}>•</span>
            <span>تنبيه: يمكن تعديل البيانات مرة واحدة فقط كل أسبوع - يرجى التحقق من المعلومات قبل الحفظ</span>
            <span style={{ margin: '0 0.8rem', opacity: '0.6' }}>•</span>
            <span>لن تتمكن من التعديل مرة أخرى حتى مرور 7 أيام على آخر تعديل</span>
            <span style={{ margin: '0 0.8rem', opacity: '0.6' }}>•</span>
            <span>تأكد من صحة المعلومات المدخلة قبل حفظ التعديلات</span>
          </div>
          
          {/* إضافة أنماط الحركة من اليسار إلى اليمين */}
          <style>
            {`
              @keyframes marqueeLeftToRight {
                0% { transform: translateX(-50%); }
                100% { transform: translateX(0%); }
              }
            `}
          </style>
        </div>

          <div className="mb-3 md:mb-4">
              <label className={`block mb-1 md:mb-2 text-sm md:text-base font-medium ${currentGender.text}`}>
                الاسم الكامل
              </label>
              <input
                type="text"
                dir="rtl"
                className={`w-full p-2 md:p-3 text-sm text-right md:text-base rounded border ${currentGender.border} focus:outline-none focus:ring-2 ${currentGender.focusRing}`}
                value={formData.fullName}
                onChange={(e) => {
                  // السماح فقط بالأحرف العربية والإنجليزية والمسافات
                  const filteredValue = e.target.value.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '');
                  handleChange('fullName', filteredValue);
                }}
                onPaste={(e) => {
                  // منع اللصق أو معالجة المحتوى الملصوق
                  e.preventDefault();
                  const pastedText = e.clipboardData.getData('text');
                  // تصفية النص الملصوق
                  const filteredText = pastedText.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '');
                  handleChange('fullName', filteredText);
                }}
                minLength={5}
                maxLength={40}
                pattern="[a-zA-Z\u0600-\u06FF\s]{5,40}"
                required
              />
              {formData.fullName && formData.fullName.length < 5 && (
                <p className="text-red-500 text-xs mt-1">يجب أن يكون الاسم على الأقل 5 أحرف</p>
              )}
            </div>

          {/* الجنس */}
          <div className="mb-4 md:mb-6">
            <label className={`block mb-1 md:mb-2 text-sm md:text-base font-medium ${currentGender.text}`}>
              الجنس
            </label>
            <div className="flex space-x-2 md:space-x-4">
              <button
                type="button"
                className={`flex items-center justify-center p-2 md:p-3 text-sm md:text-base rounded-lg flex-1 transition-colors ${
                  formData.gender === 'male' 
                    ? `${genderClasses.male.bgPrimary} text-white` 
                    : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => handleChange('gender', 'male')}
              >
                <FaMars className="ml-1 md:ml-2" />
                ذكر
              </button>
              <button
                type="button"
                className={`flex items-center justify-center p-2 md:p-3 text-sm md:text-base rounded-lg flex-1 transition-colors ${
                  formData.gender === 'female' 
                    ? `${genderClasses.female.bgPrimary} text-white` 
                    : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => handleChange('gender', 'female')}
              >
                <FaVenus className="ml-1 md:ml-2" />
                أنثى
              </button>
            </div>
          </div>

          {/* المرحلة الدراسية */}
          <div className="mb-4 md:mb-6">
            <label className={`block mb-1 md:mb-2 text-sm md:text-base font-medium ${currentGender.text}`}>
              المرحلة الدراسية
            </label>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {[
                { value: 'middle', label: 'إعدادي', icon: <FaSchool size={14} className="md:text-base" /> },
                { value: 'high', label: 'ثانوي', icon: <FaSchool size={14} className="md:text-base" /> },
                { value: 'university', label: 'جامعي', icon: <FaUniversity size={14} className="md:text-base" /> }
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`p-2 md:p-3 text-xs md:text-sm rounded-lg flex flex-col items-center transition-colors ${
                    formData.education.level === item.value 
                      ? `${currentGender.bgPrimary} text-white` 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => handleEducationChange('level', item.value)}
                >
                  {item.icon}
                  <span className="mt-1">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* مكونات المراحل الدراسية */}
          {formData.education.level === 'middle' && (
            <MiddleSchoolForm 
              education={formData.education}
              onChange={handleEducationChange}
              currentGender={currentGender}
            />
          )}

          {formData.education.level === 'high' && (
            <HighSchoolForm 
              education={formData.education}
              onChange={handleEducationChange}
              currentGender={currentGender}
            />
          )}

          {formData.education.level === 'university' && (
            <UniversityForm 
              education={formData.education}
              onChange={handleEducationChange}
              currentGender={currentGender}
            />
          )}

          {/* زر الإرسال */}
          <div className="mt-6 md:mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 md:py-3 px-4 rounded-lg font-bold text-white transition-all duration-500 flex items-center justify-center ${
              isSubmitting 
                ? 'opacity-70 ' + currentGender.bgPrimary 
                : currentGender.bgPrimary
            }`}
          >
            {isSubmitting ? (
              <>
                {/* أنيميشن التحميل */}
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري الحفظ...
              </>
            ) : (
              'حفظ البيانات'
            )}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

interface EducationFormProps {
  education: UserEducation;
  onChange: (field: keyof UserEducation, value: any) => void;
  currentGender: {
    bgPrimary: string;
    bgSecondary: string;
    text: string;
    border: string;
    focusRing: string;
  };
}

const MiddleSchoolForm: React.FC<EducationFormProps> = ({ education, onChange, currentGender }) => (
  <div className={`mb-4 md:mb-6 p-3 md:p-4 rounded-lg bg-white bg-opacity-70 text-right`}>
    <h3 className={`font-bold mb-2 md:mb-3 text-sm text-right md:text-base flex items-center ${currentGender.text}`}>
      <FaSchool className="mr-2 md:ml-2" /> معلومات المرحلة الإعدادية 
    </h3>

    <div className="mb-3 md:mb-4">
      <label className={`block mb-1 md:mb-2 text-sm md:text-base ${currentGender.text}`}>الصف الدراسي</label>
      <select
        dir="rtl"
        className={`w-full p-2 md:p-3 text-sm text-right md:text-base rounded border ${currentGender.border} focus:outline-none focus:ring-2 ${currentGender.focusRing}`}
        value={education.grade || ''}
        onChange={(e) => onChange('grade', e.target.value)}
        required
      >
        <option value="">اختر الصف</option>
        <option value="first">السابع</option>
        <option value="second">الثامن</option>
        <option value="third">التاسع</option>
      </select>
    </div>

    <div className="flex items-center">
      <input
        type="checkbox"
        id="middleDegree"
        className="mr-2 h-4 w-4 md:h-5 md:w-5"
        style={{ accentColor: currentGender.text }}
        checked={education.degreeSeeking || false}
        onChange={(e) => onChange('degreeSeeking', e.target.checked)}
      />
      <label htmlFor="middleDegree" className={`text-xs md:text-sm ${currentGender.text} `}>
        أنا في مرحلة استخراج شهادة الإعدادية
      </label>
    </div>
  </div>
);

const HighSchoolForm: React.FC<EducationFormProps> = ({ education, onChange, currentGender }) => (
  <div className={`mb-4 md:mb-6 p-3 md:p-4 rounded-lg bg-white bg-opacity-70`} >
    <h3 className={`font-bold mb-2 md:mb-3 text-sm md:text-base flex items-center ${currentGender.text}`}>
      <FaSchool className="mr-2 md:ml-2" /> معلومات المرحلة الثانوية
    </h3>

    <div className="mb-3 md:mb-4">
      <label className={`block mb-1 md:mb-2 text-sm md:text-base ${currentGender.text}`}>الصف الدراسي</label>
      <select
        dir="rtl"
        className={`w-full p-2 md:p-3 text-sm text-right md:text-base rounded border ${currentGender.border} focus:outline-none focus:ring-2 ${currentGender.focusRing}`}
        value={education.grade || ''}
        onChange={(e) => onChange('grade', e.target.value)}
        required
      >
        <option value="">اختر الصف</option>
        <option value="first">العاشر</option>
        <option value="second">الحادي عشر</option>
        <option value="third">البكلوريا</option>
      </select>
    </div>

    <div className="mb-3 md:mb-4">
      <label className={`block mb-1 md:mb-2 text-sm md:text-base ${currentGender.text}`}>التخصص</label>
      <div className="grid grid-cols-3 gap-2">
        {[
          { value: 'scientific', label: 'علمي' },
          { value: 'literary', label: 'أدبي' },
          { value: 'vocational', label: 'مهني' }
        ].map((track) => (
          <button
            key={track.value}
            type="button"
            className={`p-2 text-xs md:text-sm rounded ${
              education.track === track.value 
                ? `${currentGender.bgPrimary} text-white` 
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => onChange('track', track.value)}
          >
            {track.label}
          </button>
        ))}
      </div>
    </div>

    <div className="flex items-center">
      <input
        type="checkbox"
        id="highDegree"
        className="mr-2 h-4 w-4 md:h-5 md:w-5"
        style={{ accentColor: currentGender.text }}
        checked={education.degreeSeeking || false}
        onChange={(e) => onChange('degreeSeeking', e.target.checked)}
      />
      <label htmlFor="highDegree" className={`text-xs md:text-sm ${currentGender.text}`}>
        أنا في مرحلة استخراج شهادة الثانوية
      </label>
    </div>
  </div>
);

const UniversityForm: React.FC<EducationFormProps> = ({ education, onChange, currentGender }) => (
  <div className={`mb-4 md:mb-6 p-3 md:p-4 rounded-lg bg-white bg-opacity-70`}>
    <h3 className={`font-bold mb-2 md:mb-3 text-sm md:text-base flex items-center ${currentGender.text}`}>
      <FaUniversity className="mr-2 md:ml-2" /> معلومات المرحلة الجامعية
    </h3>

    <div className="mb-3 md:mb-4">
      <label className={`block mb-1 md:mb-2 text-sm md:text-base ${currentGender.text}`}>الجامعة</label>
      <input
        type="text"
        dir="rtl"
        className={`w-full p-2 md:p-3 text-sm text-right md:text-base rounded border ${currentGender.border} focus:outline-none focus:ring-2 ${currentGender.focusRing}`}
        value={education.university || ''}
        onChange={(e) => onChange('university', e.target.value)}
        required
      />
    </div>

    <div className="mb-3 md:mb-4">
      <label className={`block mb-1 md:mb-2 text-sm md:text-base ${currentGender.text}`}>الكلية/الفرع</label>
      <input
        type="text"
        dir="rtl"
        className={`w-full p-2 md:p-3 text-sm text-right md:text-base rounded border ${currentGender.border} focus:outline-none focus:ring-2 ${currentGender.focusRing}`}
        value={education.faculty || ''}
        onChange={(e) => onChange('faculty', e.target.value)}
        required
      />
    </div>

    <div className="mb-3 md:mb-4">
      <label className={`block mb-1 md:mb-2 text-sm md:text-base ${currentGender.text}`}>التخصص</label>
      <input
        type="text"
        dir="rtl"
        className={`w-full p-2 md:p-3 text-sm text-right md:text-base rounded border ${currentGender.border} focus:outline-none focus:ring-2 ${currentGender.focusRing}`}
        value={education.specialization || ''}
        onChange={(e) => onChange('specialization', e.target.value)}
        required
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
      <div>
        <label className={`block mb-1 md:mb-2 text-sm md:text-base ${currentGender.text}`}>السنة الدراسية</label>
        <select
          dir="rtl"
          className={`w-full p-2 md:p-3 text-sm text-right md:text-base rounded border ${currentGender.border} focus:outline-none focus:ring-2 ${currentGender.focusRing}`}
          value={education.year || ''}
          onChange={(e) => onChange('year', e.target.value)}
          required
        >
          <option value="">اختر السنة</option>
          <option value="first">الأولى</option>
          <option value="second">الثانية</option>
          <option value="third">الثالثة</option>
          <option value="fourth">الرابعة</option>
          <option value="fifth">الخامسة</option>
          <option value="graduate">خريج</option>
        </select>
      </div>

      <div>
        <label className={`block mb-1 md:mb-2 text-sm md:text-base ${currentGender.text}`}>الرقم الجامعي</label>
        <input
          type="number"
          max="9999"
          min="1000"
          dir="rtl"
          className={`w-full p-2 md:p-3 text-sm text-right md:text-base rounded border ${currentGender.border} focus:outline-none focus:ring-2 ${currentGender.focusRing}`}
          value={education.studentId || ''}
          onChange={(e) => onChange('studentId', e.target.value)}
          required
        />
      </div>
    </div>
  </div>
);

export default UserFormComponent;