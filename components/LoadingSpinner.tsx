'use client'
import { useState, useEffect } from 'react'

const PureCSSLoader = () => {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsVisible(false), 500)
          return 100
        }
        return newProgress
      })
    }, 300)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-500">
      {/* الشعار المتحرك */}
      <div className="relative mb-8 w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin duration-2000"></div>
        <div className="absolute inset-4 rounded-full border-4 border-blue-400 border-b-transparent animate-spin duration-3000 reverse"></div>
      </div>

      {/* شريط التقدم */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* النص */}
      <p className="text-gray-700 text-lg font-medium mb-2 animate-pulse">
        {progress < 30 && 'جاري إعداد المحتوى...'}
        {progress >= 30 && progress < 70 && 'جاري تحميل البيانات...'}
        {progress >= 70 && 'على وشك الانتهاء...'}
      </p>

      {/* النسبة المئوية */}
      <span className="text-blue-600 font-bold text-xl">
        {Math.min(progress, 100)}%
      </span>

      {/* الجسيمات المتحركة */}
      {[...Array(8)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-blue-400/20"
          style={{
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 3 + 2}s ease-in infinite`,
            animationDelay: `${i * 0.5}s`
          }}
        ></div>
      ))}

      {/* تعريفات الـ Animations */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          to { transform: rotate(-360deg); }
        }
        @keyframes float {
          0% { transform: translateY(0) scale(1); opacity: 0.8; }
          100% { transform: translateY(-100px) scale(0.5); opacity: 0; }
        }
        .animate-spin {
          animation: spin 2s linear infinite;
        }
        .animate-spin.reverse {
          animation: spin-reverse 3s linear infinite;
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}

export default PureCSSLoader