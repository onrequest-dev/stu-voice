'use client';
import React, { useState } from 'react';
import { FaFlag, FaSpinner } from 'react-icons/fa';
import Alert from './Alert';
import { rutID } from '@/client_helpers/userStorage';

interface ReportComponentProps {
  id: string;
  username: string;
  type: 'p' | 'c'; // 'p' for post, 'c' for comment
}

const userId = rutID();

const ReportComponent: React.FC<ReportComponentProps> = ({ id, username, type }) => {
  const [showReportPanel, setShowReportPanel] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [otherText, setOtherText] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // حالة جديدة للتحكم في الأنيميشن

  const reportOptions = [
    'إساءة الألفاظ',
    'حض على العنف',
    'الشخصنة',
    'لا يتوافق مع المنصة',
    'أخرى'
  ];

  const handleReport = () => {
    setShowReportPanel(true);
  };

  const handleOptionToggle = (option: string) => {
    setSelectedOptions(prev => {
      if (prev.includes(option)) {
        return prev.filter(item => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true); // بدء الأنيميشن
    
    const reportData = {
      'المُبلِغ': userId || "غير معروف",
      'المُبلَغ عنه': username,
      'النوع': type === 'p' ? 'منشور' : 'تعليق',
      'المعرف': id,
      'الأسباب': selectedOptions,
      'نص إضافي': otherText || 'لا يوجد',
      'رابط': `https://stu-voice.vercel.app/posts/${type === 'p' ? id : `comment/${id}`}`
    };

    try {
      const messageText = Object.entries(reportData)
        .map(([key, value]) => `*${key}:* ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('\n');
      
      const response = await fetch(
        `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID,
            text: `📢 *بلاغ جديد*\n\n${messageText}`,
            parse_mode: 'Markdown'
          })
        }
      );

      if (!response.ok) throw new Error('فشل في إرسال البلاغ');

      setShowReportPanel(false);
      setShowAlert(true);
      setSelectedOptions([]);
      setOtherText('');
    } catch (error) {
      console.error('حدث خطأ أثناء إرسال البلاغ:', error);
      setShowAlert(true);
    } finally {
      setIsSubmitting(false); // إيقاف الأنيميشن بغض النظر عن النتيجة
    }
  };

  const handleClosePanel = () => {
    setShowReportPanel(false);
    setSelectedOptions([]);
    setOtherText('');
  };

  return (
    <div className="relative">
      {/* زر الإبلاغ */}
      <button
        onClick={handleReport}
        className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
        title="الإبلاغ"
      >
        <FaFlag size={12}/>
      </button>

      {/* لوحة الإبلاغ */}
      {showReportPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl text-right">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {type === 'p' ? 'الإبلاغ عن منشور' : 'الإبلاغ عن تعليق'}
              </h3>
              <button 
                onClick={handleClosePanel}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">: سبب البلاغ</p>
              
              <div className="grid grid-cols-2 gap-2">
                {reportOptions.map((option) => (
                  <label 
                    key={option}
                    className="flex items-center rounded-md cursor-pointer hover:bg-gray-50 ml-2 text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleOptionToggle(option)}
                      className="mr-2 ml-2 h-4 w-4 text-blue-600 text-xs rounded focus:ring-blue-500 "
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {selectedOptions.includes('أخرى') && (
              <div className="mb-4">
                <textarea
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="الرجاء كتابة السبب..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-right"
                  rows={3}
                />
              </div>
            )}
            
            <div className="flex justify-end space-x-2 space-x-reverse pt-2">
              <button
                onClick={handleClosePanel}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 rounded-md border border-gray-300 hover:bg-gray-50 mr-2"
              >
                إلغاء
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedOptions.length === 0 || (selectedOptions.includes('أخرى') && !otherText) || isSubmitting}
                className={`px-4 py-2 text-sm rounded-md flex items-center justify-center min-w-[80px] ${
                  selectedOptions.length === 0 || (selectedOptions.includes('أخرى') && !otherText)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {isSubmitting ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  'إبلاغ'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* رسالة التأكيد */}
      {showAlert && (
        <Alert
          message="شكراً 🌹، سيتم مراجعة الإبلاغ من قبل الإدارة واتخاذ الإجراء المناسب. شكراً لحفاظك على سلامة المنصة 😊"
          type="success"
          autoDismiss={5000}
          onDismiss={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default ReportComponent;