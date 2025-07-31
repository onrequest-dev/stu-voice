'use client';
import { useState, useEffect } from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

interface CommentRulesAlertProps {
  isManualTrigger?: boolean;
  onClose: (permanent: boolean) => void;
}

const CommentRulesAlert = ({ 
  isManualTrigger = false, 
  onClose 
}: CommentRulesAlertProps) => {
  const [timeLeft, setTimeLeft] = useState(isManualTrigger ? 0 : 10);

  useEffect(() => {
    if (!isManualTrigger) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isManualTrigger, onClose]);

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 bg-white border border-red-300 rounded-lg shadow-xl p-4 animate-fade-in">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-red-600 flex items-center">
          <FaExclamationTriangle className="mr-2" />
          تنبيه هام: شروط التعليق
        </h3>
        <button
          onClick={() => onClose(false)}
          className="text-gray-500 hover:text-gray-700"
          aria-label="إغلاق التنبيه"
        >
          <FaTimes />
        </button>
      </div>

      <div className="mb-4 text-gray-700 space-y-2">
        <p>• يرجى الالتزام بأدب الحوار وعدم استخدام الألفاظ المسيئة</p>
        <p>• عدم التحريض على الكراهية أو العنف</p>
        <p>• احترام آراء الآخرين وتجنب الشخصنة</p>
        <p className="font-semibold mt-2">
          في حال صادفت تعليقاً مسيئاً:
        </p>
        <p>1. قم بالإبلاغ عن التعليق باستخدام الأداة المخصصة لذلك</p>
        <p>2. سيتم مراجعة التقرير من قبل الإدارة</p>
      </div>

      {!isManualTrigger && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            سيتم إغلاق التنبيه تلقائياً خلال {timeLeft} ثانية
          </span>
          <button
            onClick={() => onClose(true)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            عدم إظهار هذا التنبيه مجدداً
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentRulesAlert;