'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FiAlertCircle, FiX, FiCheckCircle, FiInfo, FiBell } from 'react-icons/fi';

type AlertType = 'error' | 'success' | 'info' | 'warning';

interface AlertProps {
  message: string;
  type?: AlertType;
  autoDismiss?: number;
  onDismiss?: () => void;
}

const Alert: React.FC<AlertProps> = ({ 
  message, 
  type = 'info', 
  autoDismiss = 3000, 
  onDismiss 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  // ألوان وأنماط لكل نوع
  const alertStyles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <FiAlertCircle className="text-red-500" size={24} />,
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <FiCheckCircle className="text-green-500" size={24} />,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <FiInfo className="text-blue-500" size={24} />,
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: <FiBell className="text-amber-500" size={24} />,
    },
  };

  useEffect(() => {
    if (message) {
      showAlert();
    }
    return () => {
      clearTimers();
    };
  }, [message]);

  const showAlert = () => {
    clearTimers();
    setIsVisible(true);
    setIsClosing(false);
    
    if (autoDismiss > 0) {
      timerRef.current = setTimeout(() => {
        hideAlert();
      }, autoDismiss);
    }
  };

  const hideAlert = () => {
    setIsClosing(true);
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
      if (onDismiss) onDismiss();
    }, 300);
  };

  const clearTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    hideAlert();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center pt-4 px-4 pointer-events-none z-50">
      <div
        ref={alertRef}
        className={`relative w-full max-w-md pointer-events-auto transform transition-all duration-300 ${
          isClosing ? 'translate-y-0 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <div 
          className={`flex items-start p-4 rounded-xl shadow-lg ${alertStyles[type].bg} ${alertStyles[type].border} border`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* أيقونة التنبيه */}
          <div className="flex-shrink-0 mt-0.5">
            {alertStyles[type].icon}
          </div>

          {/* محتوى التنبيه */}
          <div className="ml-3 flex-1">
            <div className="flex justify-between items-start">
              <h3 className={`font-medium ${alertStyles[type].text}`}>
                {type === 'error' && 'خطأ'}
                {type === 'success' && 'نجاح'}
                {type === 'info' && 'معلومة'}
                {type === 'warning' && 'تحذير'}
              </h3>
              <button
                onClick={handleClose}
                className={`ml-2 p-1 rounded-full hover:bg-opacity-20 hover:bg-gray-500 transition-colors ${alertStyles[type].text}`}
                aria-label="إغلاق"
              >
                <FiX size={18} />
              </button>
            </div>
            <p className={`mt-1 text-sm ${alertStyles[type].text}`}>{message}</p>
          </div>

          {/* شريط التقدم للتنبيه التلقائي */}
          {autoDismiss > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-xl overflow-hidden">
              <div 
                className={`h-full ${type === 'error' ? 'bg-red-500' : ''} 
                            ${type === 'success' ? 'bg-green-500' : ''} 
                            ${type === 'info' ? 'bg-blue-500' : ''} 
                            ${type === 'warning' ? 'bg-amber-500' : ''}`}
                style={{
                  animation: `progress ${autoDismiss}ms linear forwards`,
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* أنيميشن شريط التقدم */}
      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Alert;