'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FaExclamation, FaTimes } from 'react-icons/fa';

interface AlertProps {
  message: string;
  onDismiss?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAlerting, setIsAlerting] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (message) {
      showAlert();
    } else {
      hideAlert();
    }

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, [message]);

  const showAlert = () => {
    setIsVisible(true);
    setIsAnimating(true);
    startAlertAnimation();
    document.addEventListener('click', handleOutsideClick);
  };

  const hideAlert = () => {
    stopAlertAnimation();
    setIsAnimating(false);
    animationRef.current = setTimeout(() => {
      setIsVisible(false);
      if (onDismiss) onDismiss();
      document.removeEventListener('click', handleOutsideClick);
    }, 300);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (alertRef.current && !alertRef.current.contains(e.target as Node)) {
      hideAlert();
    }
  };

  const handleClose = () => {
    hideAlert();
  };

  const startAlertAnimation = () => {
    setIsAlerting(true);
  };

  const stopAlertAnimation = () => {
    setIsAlerting(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-8 left-4 right-4 flex justify-center z-50">
      <div
        ref={alertRef}
        className={`relative flex items-start bg-red-50 rounded-lg shadow-xl border-2 border-red-300 w-full max-w-xs transform transition-all duration-300 ${
          isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}
      >
        {/* Exclamation Icon with pulsating effect */}
        <div className={`absolute -left-4 -top-4 p-3 rounded-full text-white shadow-lg ${
          isAlerting ? 'bg-red-600 animate-pulse' : 'bg-red-500'
        }`}>
          <FaExclamation size={20} />
        </div>

        {/* Pulsing waves effect (modified for alert) */}
        {isAlerting && (
          <>
            <div className="absolute -left-5 -top-5 w-14 h-14 border-2 border-red-400 rounded-full animate-ping opacity-75"></div>
            <div className="absolute -left-6 -top-6 w-16 h-16 border-2 border-red-300 rounded-full animate-ping opacity-50"></div>
          </>
        )}

        {/* Alert Content */}
        <div className="flex-1 p-4 pl-8">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-red-800 font-bold text-sm mb-1">تنبيه هام !</h3>
              <p className="text-red-700 text-sm md:text-base">{message}</p>
            </div>
            <button
              onClick={handleClose}
              className="ml-2 text-red-400 hover:text-red-600 transition-colors"
              aria-label="إغلاق التنبيه"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>

        {/* Alert bubble tail */}
        <div className="absolute -left-3 top-6 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-red-300 border-b-8 border-b-transparent"></div>

        {/* Red accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-b-lg"></div>
      </div>
    </div>
  );
};

export default Alert;