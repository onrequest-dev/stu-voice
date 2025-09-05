'use client';
import React, { useState, useEffect } from 'react';
import { FaVenus, FaMars, FaSchool, FaUniversity } from 'react-icons/fa';
import { UserEducation, UserInfo } from '../types/types';
import IconPicker from './IconPicker';
import { useRouter } from 'next/navigation';
type Errors = {
  fullName?: string;
  educationLevel?: string;
  grade?: string;
  track?: string;
  degreeSeeking?: string; // إن أردت جعله إجباري يمكن استخدامه
  university?: string;
  faculty?: string;
  specialization?: string;
  year?: string;
  studentId?: string;
  general?: string;
};

const UserFormComponent: React.FC<{
  onSubmit: (data: UserInfo) => Promise<void> | void;
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
          bgColor: '#ffffff',
        },
      },
    }
  );

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const router = useRouter();


  useEffect(()=>{
    const hasComplete = sessionStorage.getItem("has_complete");
      if (hasComplete === "true") {
        router.push('/');
        sessionStorage.removeItem("has_complete");
      }
  },[])

  useEffect(() => {
    if (!initialData) {
      const storedData = localStorage.getItem('userInfo');
      if (storedData) {
        try {
          const parsed: UserInfo = JSON.parse(storedData);
          setFormData(parsed);
        } catch {}
      }
    }
  }, [initialData]);

  const handleChange = (field: keyof UserInfo, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // تحديث الأخطاء عند التغيير
    setErrors((prev) => {
    if (field === 'fullName') {
    const { fullName, ...rest } = prev;
    return rest; // يحذف خطأ fullName إن وجد
    }
    return prev;
    });
  };

  const handleEducationChange = (field: keyof UserEducation, value: any) => {
    setFormData((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [field]: value,
      },
    }));
    // تنظيف أخطاء الحقول الخاصة بالتعليم عند التغيير
    setErrors((prev) => {
      const updated = { ...prev };
      if (field === 'level') delete updated.educationLevel;
      if (field === 'grade') delete updated.grade;
      if (field === 'track') delete updated.track;
      if (field === 'university') delete updated.university;
      if (field === 'faculty') delete updated.faculty;
      if (field === 'specialization') delete updated.specialization;
      if (field === 'year') delete updated.year;
      if (field === 'studentId') delete updated.studentId;
      return updated;
    });
  };

  const handleIconChange = (iconName: string, color: string, bgColor: string) => {
    handleEducationChange('icon', {
      component: iconName,
      color,
      bgColor,
    });
  };

  const genderClasses = {
    male: {
      bgPrimary: 'bg-blue-500',
      bgSecondary: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-300',
      focusRing: 'focus:ring-blue-500',
    },
    female: {
      bgPrimary: 'bg-pink-500',
      bgSecondary: 'bg-pink-100',
      text: 'text-pink-800',
      border: 'border-pink-300',
      focusRing: 'focus:ring-pink-500',
    },
  };

  const currentGender = genderClasses[formData.gender];

  // التحقق الشامل قبل الإرسال
  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    const name = (formData.fullName || '').trim();

    // الاسم
    if (!name) {
      newErrors.fullName = 'الاسم مطلوب';
    } else if (name.length < 5) {
      newErrors.fullName = 'يجب أن يكون الاسم على الأقل 5 أحرف';
    } else if (!/^[a-zA-Z\u0600-\u06FF\s]{5,40}$/.test(name)) {
      newErrors.fullName = 'يسمح فقط بالأحرف العربية/الإنجليزية والمسافات (5-40)';
    }

    // المرحلة
    const level = formData.education?.level;
    if (!level) {
      newErrors.educationLevel = 'يجب اختيار المرحلة الدراسية';
    }

    // حقول مطلوبة حسب المرحلة
    if (level === 'middle') {
      if (!formData.education.grade) newErrors.grade = 'اختر الصف الدراسي';
      // degreeSeeking ليس إجبارياً عادةً، اتركه اختياري
    } else if (level === 'high') {
      if (!formData.education.grade) newErrors.grade = 'اختر الصف الدراسي';
      if (!formData.education.track) newErrors.track = 'اختر التخصص';
    } else if (level === 'university') {
      if (!formData.education.university || !formData.education.university.trim())
        newErrors.university = 'اسم الجامعة مطلوب';
      if (!formData.education.faculty || !formData.education.faculty.trim())
        newErrors.faculty = 'اسم الكلية/الفرع مطلوب';
      if (!formData.education.specialization || !formData.education.specialization.trim())
        newErrors.specialization = 'التخصص مطلوب';
      if (!formData.education.year) newErrors.year = 'اختر السنة الدراسية';

      const id = String(formData.education.studentId ?? '').trim();
      if (!id) {
        newErrors.studentId = 'الرقم الجامعي مطلوب';
      } else if (!/^\d{1,}$/.test(id)) {
        newErrors.studentId = 'الرقم الجامعي يجب أن يكون أرقاماً (1 خانات فأكثر)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);

    if (!validateForm()) {
      // رسالة عامة أعلى الزر
      setErrors((prev) => ({
        ...prev,
        general: 'يرجى تصحيح الأخطاء قبل الحفظ',
      }));
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 2000);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: 'حدث خطأ أثناء الحفظ. حاول مرة أخرى.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative text-right">
      <div
        className={`max-w-2xl mx-auto p-4 md:p-6 rounded-lg shadow-lg transition-all duration-300 ${currentGender.bgSecondary} border ${currentGender.border} mt-12`}
      >
        {/* أيقونة */}
        <div className="mx-auto -mt-16 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white">
          <IconPicker
            onIconChange={handleIconChange}
            initialIcon={formData.education.icon?.component}
            initialColor={formData.education.icon?.color }
            initialBgColor={formData.education.icon?.bgColor }
          />
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* شريط تنبيه متحرك */}
          <div
            style={{
              background: 'transparent',
              color: '#555',
              padding: '0.4rem 1rem',
              borderRadius: '4px',
              marginBottom: '1.5rem',
              overflow: 'hidden',
              position: 'relative',
              fontFamily: 'inherit',
            }}
            className="mt-2"
          >
            <div
              style={{
                animation: 'marqueeLeftToRight 20s linear infinite',
                whiteSpace: 'nowrap',
                fontSize: '0.8rem',
                fontWeight: '300',
                display: 'inline-block',
              }}
            >
              <span style={{ margin: '0 0.8rem', opacity: '0.6' }}>•</span>
              <span>تنبيه: يمكن تعديل البيانات مرة واحدة فقط كل أسبوع - يرجى التحقق من المعلومات قبل الحفظ</span>
              <span style={{ margin: '0 0.8rem', opacity: '0.6' }}>•</span>
              <span>لن تتمكن من التعديل مرة أخرى حتى مرور 7 أيام على آخر تعديل</span>
              <span style={{ margin: '0 0.8rem', opacity: '0.6' }}>•</span>
              <span>تأكد من صحة المعلومات المدخلة قبل حفظ التعديلات</span>

              <span style={{ margin: '0 0.8rem', opacity: '0.6' }}>•</span>
              <span>تنبيه: يمكن تعديل البيانات مرة واحدة فقط كل أسبوع - يرجى التحقق من المعلومات قبل الحفظ</span>
              <span style={{ margin: '0 0.8rem', opacity: '0.6' }}>•</span>
              <span>لن تتمكن من التعديل مرة أخرى حتى مرور 7 أيام على آخر تعديل</span>
              <span style={{ margin: '0 0.8rem', opacity: '0.6' }}>•</span>
              <span>تأكد من صحة المعلومات المدخلة قبل حفظ التعديلات</span>
            </div>

            <style>
              {`
                @keyframes marqueeLeftToRight {
                  0% { transform: translateX(-50%); }
                  100% { transform: translateX(0%); }
                }
              `}
            </style>
          </div>

          {/* الاسم الكامل */}
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
                const filteredValue = e.target.value.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '');
                handleChange('fullName' as any, filteredValue);
              }}
              onPaste={(e) => {
                e.preventDefault();
                const pastedText = e.clipboardData.getData('text');
                const filteredText = pastedText.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '');
                handleChange('fullName' as any, filteredText);
              }}
              minLength={5}
              maxLength={40}
              pattern="[a-zA-Z\u0600-\u06FF\s]{5,40}"
              required
              aria-invalid={!!errors.fullName}
              aria-describedby="fullName-error"
            />
            {errors.fullName ? (
              <p id="fullName-error" className="text-red-500 text-xs mt-1">
                {errors.fullName}
              </p>
            ) : formData.fullName && formData.fullName.length < 5 ? (
              <p className="text-red-500 text-xs mt-1">يجب أن يكون الاسم على الأقل 5 أحرف</p>
            ) : null}
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
                  formData.gender === 'male' ? `${currentGender.bgPrimary} text-white` : 'bg-gray-200 text-gray-700'
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
                    ? `${currentGender.bgPrimary} text-white`
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
          <div className="mb-2 md:mb-3">
            <label className={`block mb-1 md:mb-2 text-sm md:text-base font-medium ${currentGender.text}`}>
              المرحلة الدراسية
            </label>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {[
                { value: 'middle', label: 'إعدادي', icon: <FaSchool size={14} className="md:text-base" /> },
                { value: 'high', label: 'ثانوي', icon: <FaSchool size={14} className="md:text-base" /> },
                { value: 'university', label: 'جامعي', icon: <FaUniversity size={14} className="md:text-base" /> },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`p-2 md:p-3 text-xs md:text-sm rounded-lg flex flex-col items-center transition-colors ${
                    formData.education.level === item.value ? `${currentGender.bgPrimary} text-white` : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => handleEducationChange('level', item.value)}
                  aria-pressed={formData.education.level === item.value}
                >
                  {item.icon}
                  <span className="mt-1">{item.label}</span>
                </button>
              ))}
            </div>
            {errors.educationLevel && (
              <p className="text-red-500 text-xs mt-1">{errors.educationLevel}</p>
            )}
          </div>

          {/* مكونات المراحل الدراسية */}
          {formData.education.level === 'middle' && (
            <MiddleSchoolForm education={formData.education} onChange={handleEducationChange} currentGender={currentGender} errors={errors} />
          )}

          {formData.education.level === 'high' && (
            <HighSchoolForm education={formData.education} onChange={handleEducationChange} currentGender={currentGender} errors={errors} />
          )}

          {formData.education.level === 'university' && (
            <UniversityForm education={formData.education} onChange={handleEducationChange} currentGender={currentGender} errors={errors} />
          )}

          {/* رسالة عامة وأزرار */}
          {errors.general && <p className="text-red-600 text-sm mt-2">{errors.general}</p>}
          {/* {submitSuccess && <p className="text-green-600 text-sm mt-2">تم الحفظ بنجاح</p>} */}

          <div className="mt-6 md:mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 md:py-3 px-4 rounded-lg font-bold text-white transition-all duration-500 flex items-center justify-center ${
                isSubmitting ? 'opacity-70 ' + currentGender.bgPrimary : currentGender.bgPrimary
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
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
  errors: Errors;
}

const MiddleSchoolForm: React.FC<EducationFormProps> = ({ education, onChange, currentGender, errors }) => (
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
        aria-invalid={!!errors.grade}
        aria-describedby="middle-grade-error"
        required
      >
        <option value="">اختر الصف</option>
        <option value="first">السابع</option>
        <option value="second">الثامن</option>
        <option value="third">التاسع</option>
      </select>
      {errors.grade && <p id="middle-grade-error" className="text-red-500 text-xs mt-1">{errors.grade}</p>}
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

const HighSchoolForm: React.FC<EducationFormProps> = ({ education, onChange, currentGender, errors }) => (
  <div className={`mb-4 md:mb-6 p-3 md:p-4 rounded-lg bg-white bg-opacity-70`}>
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
        aria-invalid={!!errors.grade}
        aria-describedby="high-grade-error"
        required
      >
        <option value="">اختر الصف</option>
        <option value="first">العاشر</option>
        <option value="second">الحادي عشر</option>
        <option value="third">البكلوريا</option>
      </select>
      {errors.grade && <p id="high-grade-error" className="text-red-500 text-xs mt-1">{errors.grade}</p>}
    </div>

    <div className="mb-3 md:mb-4">
      <label className={`block mb-1 md:mb-2 text-sm md:text-base ${currentGender.text}`}>التخصص</label>
      <div className="grid grid-cols-3 gap-2">
        {[
          { value: 'scientific', label: 'علمي' },
          { value: 'literary', label: 'أدبي' },
          { value: 'vocational', label: 'مهني' },
        ].map((track) => (
          <button
            key={track.value}
            type="button"
            className={`p-2 text-xs md:text-sm rounded ${
              education.track === track.value ? `${currentGender.bgPrimary} text-white` : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => onChange('track', track.value)}
            aria-pressed={education.track === track.value}
          >
            {track.label}
          </button>
        ))}
      </div>
      {errors.track && <p className="text-red-500 text-xs mt-1">{errors.track}</p>}
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

const UniversityForm: React.FC<EducationFormProps> = ({ education, onChange, currentGender, errors }) => (
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
        aria-invalid={!!errors.university}
        aria-describedby="university-error"
        required
      />
      {errors.university && <p id="university-error" className="text-red-500 text-xs mt-1">{errors.university}</p>}
    </div>

    <div className="mb-3 md:mb-4">
      <label className={`block mb-1 md:mb-2 text-sm md:text-base ${currentGender.text}`}>الكلية/الفرع</label>
      <input
        type="text"
        dir="rtl"
        className={`w-full p-2 md:p-3 text-sm text-right md:text-base rounded border ${currentGender.border} focus:outline-none focus:ring-2 ${currentGender.focusRing}`}
        value={education.faculty || ''}
        onChange={(e) => onChange('faculty', e.target.value)}
        aria-invalid={!!errors.faculty}
        aria-describedby="faculty-error"
        required
      />
      {errors.faculty && <p id="faculty-error" className="text-red-500 text-xs mt-1">{errors.faculty}</p>}
    </div>

    <div className="mb-3 md:mb-4">
      <label className={`block mb-1 md:mb-2 text-sm md:text-base ${currentGender.text}`}>التخصص</label>
      <input
        type="text"
        dir="rtl"
        className={`w-full p-2 md:p-3 text-sm text-right md:text-base rounded border ${currentGender.border} focus:outline-none focus:ring-2 ${currentGender.focusRing}`}
        value={education.specialization || ''}
        onChange={(e) => onChange('specialization', e.target.value)}
        aria-invalid={!!errors.specialization}
        aria-describedby="specialization-error"
        required
      />
      {errors.specialization && <p id="specialization-error" className="text-red-500 text-xs mt-1">{errors.specialization}</p>}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
      <div>
        <label className={`block mb-1 md:mb-2 text-sm md:text-base ${currentGender.text}`}>السنة الدراسية</label>
        <select
          dir="rtl"
          className={`w-full p-2 md:p-3 text-sm text-right md:text-base rounded border ${currentGender.border} focus:outline-none focus:ring-2 ${currentGender.focusRing}`}
          value={education.year || ''}
          onChange={(e) => onChange('year', e.target.value)}
          aria-invalid={!!errors.year}
          aria-describedby="year-error"
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
        {errors.year && <p id="year-error" className="text-red-500 text-xs mt-1">{errors.year}</p>}
      </div>

      <div>
        <label className={`block mb-1 md:mb-2 text-sm md:text-base ${currentGender.text}`}>الرقم الجامعي</label>
        <input
          type="number"
          dir="rtl"
          className={`w-full p-2 md:p-3 text-sm text-right md:text-base rounded border ${currentGender.border} focus:outline-none focus:ring-2 ${currentGender.focusRing}`}
          value={education.studentId || ''}
          onChange={(e) => onChange('studentId', e.target.value)}
          aria-invalid={!!errors.studentId}
          aria-describedby="studentId-error"
          required/>
        {errors.studentId && <p id="studentId-error" className="text-red-500 text-xs mt-1">{errors.studentId}</p>}
      </div>
    </div>
  </div>
);

export default UserFormComponent;