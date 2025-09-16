'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signupUser } from '@/client_helpers/signup';
import { getClientFingerprint } from '@/client_helpers/getfingerprint';
import Alert from '../Alert';
import { FiEye, FiEyeOff } from 'react-icons/fi';
const SignUpHero = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInvalidChar, setHasInvalidChar] = useState(false);
  const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  // دالة توليد كلمة مرور عشوائية قوية
  const generateStrongPassword = () => {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{};:,.<>?';
    const allChars = lower + upper + numbers + symbols;

    const length = Math.floor(Math.random() * (16 - 8 + 1)) + 8;
    let password = '';

    // ضمان وجود نوع واحد على الأقل من كل مجموعة
    password += lower[Math.floor(Math.random() * lower.length)];
    password += upper[Math.floor(Math.random() * upper.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // خلط المحارف
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    // تحديث الحقول
    setFormData(prev => ({ ...prev, password, confirmPassword: password }));

    // نسخ للحافظة
    navigator.clipboard.writeText(password).then(() => {
      setAlertMessage(' تم اقتراح كلمة مرور قوية ونسخها للحافظة. يُرجى لصقها في مكان آمن على جهازك');
    });
  };

  // حساب قوة كلمة المرور
  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0;

    const len = password.length;
    let score = 0;

    if (len >= 8) score += 2;
    if (len >= 12) score += 2;
    if (len >= 16) score += 1;

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    const varietyCount = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;
    score += Math.min(varietyCount, 3);
    if (varietyCount === 4) score += 1;

    if (/[A-Z].*[A-Z]/.test(password)) score += 1;
    if (/\d.*\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9].*[^A-Za-z0-9]/.test(password)) score += 1;

    const hasSequential = (str: string) => {
      for (let i = 0; i < str.length - 2; i++) {
        const a = str.charCodeAt(i);
        const b = str.charCodeAt(i + 1);
        const c = str.charCodeAt(i + 2);
        if (b === a + 1 && c === b + 1) return true;
        if (b === a - 1 && c === b - 1) return true;
      }
      return false;
    };

    const weakPatterns =
      hasSequential(password) ||
      hasSequential(password.toLowerCase()) ||
      /qwerty|asdf|zxcv|password|pass|admin|welcome|letmein/i.test(password);

    if (weakPatterns) score -= 2;
    if (/(.)\1{2,}/.test(password)) score -= 1;
    if (/[A-Za-z]{4,}\d{1,3}$/.test(password)) score -= 1;
    if (/^\s|\s$/.test(password)) score -= 1;

    if (len < 6) {
      score = Math.min(score, 1);
    } else if (len < 8) {
      score = Math.min(score, 3);
    }

    if (len < 12) {
      score = Math.min(score, 7);
    }

    return Math.max(0, Math.min(10, score));
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalValue = e.target.value;
    const cleaned = originalValue.toLowerCase().replace(/[^a-z_]/g, '');
    setHasInvalidChar(originalValue !== cleaned);
    setFormData(prev => ({ ...prev, username: cleaned }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'privacyPolicy') {
        setAcceptedPrivacyPolicy(checked);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!acceptedPrivacyPolicy) {
      setAlertMessage('يجب الموافقة على سياسة الخصوصية أولاً');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setAlertMessage('كلمتا المرور غير متطابقتين');
      setIsLoading(false);
      return;
    }

    if (passwordStrength < 3) {
      setShowPasswordError(true);
      setAlertMessage('كلمة المرور ضعيفة. يجب أن تحتوي على الأقل 8 أحرف وتشمل حروفًا كبيرة وأرقامًا');
      setIsLoading(false);
      return;
    }

    try {
      const fingerprint = await getClientFingerprint();
      const result = await signupUser(formData.username, formData.password, fingerprint);
      if (result.success) {
        setFormData({ username: '', password: '', confirmPassword: '' });
        setPasswordStrength(0);
        let redirectUrl = new URLSearchParams(window.location.search).get('redirect');
        if (redirectUrl) {
          window.open(redirectUrl, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = '/';
        }
      } else {
        setAlertMessage(result.message || 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى');
      }
    } catch (error) {
      setAlertMessage('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  const strengthLabels = [
    'ضعيفة جدًا','ضعيفة جدًا','ضعيفة','ضعيفة','متوسطة','متوسطة','جيدة','قوية','قوية جدًا','قوية جدًا','رائعة القوة'
  ];

  const strengthColor = (s: number) => {
    if (s <= 3) return 'bg-red-500';
    if (s <= 6) return 'bg-yellow-500';
    if (s <= 8) return 'bg-green-500';
    return 'bg-emerald-600';
  };

  const isWeakPassword = (pwd: string, s: number) => {
    const len = pwd.length;
    if (len < 8) return true;
    return s < 5;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white relative overflow-hidden p-1">
      <Alert message={alertMessage} onDismiss={() => setAlertMessage('')} />

      <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-100 rounded-full opacity-20 -z-10"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-200 rounded-full opacity-15 -z-10"></div>
      <div className="absolute top-1/3 right-20 w-64 h-64 bg-blue-300 rounded-full opacity-10 -z-10"></div>
      <div className="absolute top-20 left-1/4 w-16 h-16 bg-blue-100 rounded-full opacity-25 -z-10"></div>
      <div className="absolute bottom-28 right-1/3 w-24 h-24 bg-blue-200 rounded-full opacity-20 -z-10"></div>

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl z-10 overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-48 flex items-center justify-center relative p-4">
          <div className="absolute top-8 left-8 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-8 right-8 w-28 h-28 bg-white opacity-15 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white opacity-5 rounded-full"></div>
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <Image src="/stu-voice.png" alt="StuVoice Logo" width={400} height={250} className="object-contain drop-shadow-xl" quality={100} priority />
          </div>
        </div>

        <div className="p-4 space-y-4 relative">
          <div className="absolute -top-6 right-6 w-14 h-14 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute bottom-6 left-6 w-10 h-10 bg-blue-200 rounded-full opacity-15"></div>

          <h1 className="text-3xl font-bold text-center text-gray-800">إنشاء حساب جديد</h1>

          <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم</label>
              <input type="text" id="username" name="username" value={formData.username ?? ''} onChange={handleUsernameChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required pattern="^[a-z_]+$" title="يرجى إدخال أحرف صغيرة و_ فقط" disabled={isLoading} />
              {hasInvalidChar && (
                <p className="text-sm text-red-600 mt-1">يُسمح فقط بالأحرف الإنجليزية الصغيرة والشرطة (_)</p>
              )}
            </div>

            <div>
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 hover:text-gray-700 text-2xl mt-5"
                  tabIndex={-1}
                >
                  {showPassword ? <FiEye /> : <FiEyeOff />}
                </button>
              </div>


              {/* زر اقتراح كلمة مرور */}
              <button
                type="button"
                onClick={generateStrongPassword}
                className="mt-2 px-2 py-1 text-sm font-semibold text-white bg-blue-600 border border-blue-700 rounded-lg shadow hover:bg-blue-700 hover:border-blue-800 transition">
                إنشاء كلمة ونسخها للحافظة
              </button>

              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden">
                <div className={`h-2.5 rounded-full transition-all duration-300 ease-out ${strengthColor(passwordStrength)}`} style={{ width: `${(passwordStrength / 10) * 100}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-1">قوة كلمة المرور: {strengthLabels[Math.max(0, Math.min(10, passwordStrength))]} ({passwordStrength}/10)</p>
              {showPasswordError && isWeakPassword(formData.password, passwordStrength) && (
                <p className="text-sm text-red-600 mt-1">كلمة المرور ضعيفة. يجب أن تتكون من 8 أحرف على الأقل وتضم مزيجًا من الحروف الكبيرة والصغيرة والأرقام والرموز.</p>
              )}
            </div>

            <div>
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">تأكيد كلمة المرور</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 hover:text-gray-700 text-2xl mt-5"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
                </button>
              </div>

              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">!كلمة المرور غير متطابقة</p>
              )}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input id="privacyPolicy" name="privacyPolicy" type="checkbox" checked={acceptedPrivacyPolicy} onChange={handleChange} className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" disabled={isLoading} />
              </div>
              <label htmlFor="privacyPolicy" className="ms-2 text-sm font-medium text-gray-900">
                اوافق على{' '}
                <Link href="/privacy-and-terms" className="text-blue-600 hover:underline" target="_blank" onClick={(e) => isLoading && e.preventDefault()}>
                  سياسة الخصوصية و شروط الاستخدام
                </Link>
              </label>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 transform hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -mr-1 ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري إنشاء الحساب
                </>
              ) : (
                'تسجيل'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            لديك حساب بالفعل؟{' '}
            <Link href="/log-in" className="text-blue-600 hover:text-blue-800 font-medium" onClick={(e) => isLoading && e.preventDefault()}>
              سجل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpHero;
