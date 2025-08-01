'use client';
import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus, FaPenAlt, FaPoll, FaSpinner } from 'react-icons/fa';
import Alert from '../Alert';
import { UserInfo } from './types';
import UserInfoComponent from './UserInfoComponent';

interface PostCreatorProps {
  onSubmit: (postData: {
    content: {
      opinion?: string;
      poll?: {
        question: string;
        options: string[];
        durationInDays: number;
      };
    };
  }) => Promise<void>;
  userInfo: UserInfo;
}

const PostCreator: React.FC<PostCreatorProps> = ({ onSubmit, userInfo }) => {
  // الحالات الأساسية
  const [activeTab, setActiveTab] = useState<'opinion' | 'poll' | 'both'>('opinion');
  const [opinionText, setOpinionText] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState(3); // 3 أيام كقيمة افتراضية
  
  // حالات التحكم
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'success'>('error');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // خيارات مدة الاستطلاع بالأيام
  const durationOptions = [1, 2, 3, 5, 7, 10, 14, 21, 30];

  // الكشف عن حجم الشاشة
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // معالجة إضافة خيار استطلاع
  const handleAddOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, '']);
    }
  };

  // معالجة إزالة خيار استطلاع
  const handleRemoveOption = (index: number) => {
    if (pollOptions.length > 2) {
      const newOptions = [...pollOptions];
      newOptions.splice(index, 1);
      setPollOptions(newOptions);
    }
  };

  // معالجة تغيير خيار استطلاع
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  // التحقق من صحة النموذج
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (activeTab !== 'poll' && !opinionText.trim()) {
      newErrors.opinion = 'الرجاء إدخال نص الرأي';
    }
    
    if (activeTab !== 'opinion') {
      if (!pollQuestion.trim()) {
        newErrors.pollQuestion = 'الرجاء إدخال سؤال الاستطلاع';
      }
      
      pollOptions.forEach((opt, idx) => {
        if (!opt.trim()) {
          newErrors[`pollOption_${idx}`] = 'الرجاء إدخال نص الخيار';
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // معالجة إرسال النموذج
  const handleSubmit = async () => {
    if (!validateForm()) {
      setAlertMessage('يوجد أخطاء في البيانات المدخلة');
      setAlertType('error');
      setShowAlert(true);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitProgress(0);
    
    const interval = setInterval(() => {
      setSubmitProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress > 90 ? 90 : newProgress;
      });
    }, 200);
    
    try {
      await onSubmit({
        content: {
          ...(activeTab !== 'poll' && { opinion: opinionText }),
          ...(activeTab !== 'opinion' && { 
            poll: { 
              question: pollQuestion, 
              options: pollOptions,
              durationInDays: pollDuration
            } 
          })
        }
      });
      
      setSubmitProgress(100);
      clearInterval(interval);
      
      setAlertMessage('تم إنشاء المنشور بنجاح');
      setAlertType('success');
      setShowAlert(true);
      
      // إعادة تعيين النموذج
      setTimeout(() => {
        setOpinionText('');
        setPollQuestion('');
        setPollOptions(['', '']);
        setPollDuration(3);
        setIsSubmitting(false);
        setSubmitProgress(0);
      }, 1500);
      
    } catch (error) {
      clearInterval(interval);
      setAlertMessage('حدث خطأ أثناء إنشاء المنشور');
      setAlertType('error');
      setShowAlert(true);
      setIsSubmitting(false);
      setSubmitProgress(0);
    }
  };

  // زر النشر مع الرسوم المتحركة
  const renderSubmitButton = () => (
    <button
      onClick={handleSubmit}
      disabled={isSubmitting}
      className={`relative px-6 py-3 bg-blue-600 text-white rounded-lg overflow-hidden transition-all ${
        isSubmitting ? 'cursor-wait' : 'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      } w-full md:w-auto`}
    >
      <div 
        className="absolute top-0 left-0 h-full bg-blue-700 transition-all duration-300"
        style={{ width: `${submitProgress}%` }}
      />
      <div className="relative z-10 flex items-center justify-center gap-2">
        {isSubmitting ? (
          <>
            <FaSpinner className="animate-spin" />
            <span>جاري النشر... {Math.round(submitProgress)}%</span>
          </>
        ) : (
          <span>نشر المنشور</span>
        )}
      </div>
    </button>
  );

  return (
    <div className={`w-full ${isMobile ? 'px-0' : 'max-w-2xl mx-auto px-4'} bg-white ${!isMobile && 'rounded-xl shadow-sm border border-gray-100'}`}>
      {showAlert && (
        <Alert 
          message={alertMessage}
          type={alertType}
          autoDismiss={5000}
          onDismiss={() => setShowAlert(false)}
        />
      )}
      
      <div className={`p-4 ${!isMobile && 'border-b border-gray-100'}`}>
        <h2 className="text-xl font-semibold text-gray-900 text-center">إنشاء منشور جديد</h2>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <UserInfoComponent userInfo={userInfo} />
        </div>
        
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('opinion')}
            className={`flex-1 py-3 font-medium text-xs md:text-sm flex items-center justify-center gap-1 ${activeTab === 'opinion' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            <FaPenAlt size={12} /> رأي
          </button>
          <button
            onClick={() => setActiveTab('both')}
            className={`flex-1 py-3 font-medium text-xs md:text-sm flex items-center justify-center gap-1 ${activeTab === 'both' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            <div className="flex items-center gap-1">
              <FaPenAlt size={10} />
              <FaPoll size={10} />
              <span>معاً</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('poll')}
            className={`flex-1 py-3 font-medium text-xs md:text-sm flex items-center justify-center gap-1 ${activeTab === 'poll' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            <FaPoll size={12} /> استطلاع
          </button>
        </div>
        
        {(activeTab === 'opinion' || activeTab === 'both') && (
          <div className="mb-6">
            <label htmlFor="opinion" className="block text-sm font-medium text-gray-700 mb-2">
              نص الرأي
            </label>
            <textarea
              id="opinion"
              rows={4}
              value={opinionText}
              onChange={(e) => setOpinionText(e.target.value)}
              className={`w-full px-4 py-3 border ${errors.opinion ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="ما رأيك في..."
            />
            {errors.opinion && (
              <p className="mt-1 text-sm text-red-500">{errors.opinion}</p>
            )}
          </div>
        )}
        
        {(activeTab === 'poll' || activeTab === 'both') && (
          <div className="mb-6">
            <div className="mb-4">
              <label htmlFor="pollQuestion" className="block text-sm font-medium text-gray-700 mb-2">
                سؤال الاستطلاع
              </label>
              <input
                type="text"
                id="pollQuestion"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className={`w-full px-4 py-3 border ${errors.pollQuestion ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="ماذا تفضل..."
              />
              {errors.pollQuestion && (
                <p className="mt-1 text-sm text-red-500">{errors.pollQuestion}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مدة الاستطلاع (بالأيام)
              </label>
              <select
                value={pollDuration}
                onChange={(e) => setPollDuration(Number(e.target.value))}
                className="bg-gray-100 border border-gray-300 text-gray-700 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                {durationOptions.map(days => (
                  <option key={days} value={days}>
                    {days} يوم
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                خيارات الاستطلاع (2-5 خيارات)
              </label>
              
              {pollOptions.map((option, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className={`flex-1 px-4 py-2 border ${errors[`pollOption_${index}`] ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder={`الخيار ${index + 1}`}
                  />
                  {pollOptions.length > 2 && (
                    <button
                      onClick={() => handleRemoveOption(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="إزالة الخيار"
                    >
                      <FaMinus size={14} />
                    </button>
                  )}
                </div>
              ))}
              
              {pollOptions.length < 5 && (
                <button
                  onClick={handleAddOption}
                  className="text-blue-500 text-sm mt-2 hover:underline flex items-center gap-1"
                >
                  <FaPlus size={12} />
                  إضافة خيار جديد
                </button>
              )}
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          {renderSubmitButton()}
        </div>
      </div>
    </div>
  );
};

export default PostCreator;