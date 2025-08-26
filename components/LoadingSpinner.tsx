'use client'
import { useState, useEffect } from 'react'

const PureCSSLoader = () => {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // مراحل التقدم مع قيم محددة
    const stages = [
      { target: 15, duration: 400 },
      { target: 30, duration: 600 },
      { target: 45, duration: 800 },
      { target: 60, duration: 1000 },
      { target: 75, duration: 1200 },
      { target: 90, duration: 1500 },
      { target: 100, duration: 2000 }
    ]

    let currentStage = 0

    const advanceProgress = () => {
      if (currentStage >= stages.length) {
        setTimeout(() => setIsVisible(false), 800)
        return
      }

      const stage = stages[currentStage]
      const increment = 1
      const interval = stage.duration / (stage.target - progress)

      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= stage.target) {
            clearInterval(timer)
            currentStage++
            advanceProgress()
            return prev
          }
          return Math.min(prev + increment, stage.target)
        })
      }, interval)
    }

    advanceProgress()

    return () => {}
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-500">
      {/* الشعار المتحرك - تصميم أكثر احترافية */}
      <div className="relative mb-8 w-28 h-28">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/30"></div>
        <div className="absolute inset-2 rounded-full border-4 border-blue-500 border-t-transparent animate-spin duration-1500"></div>
        <div className="absolute inset-4 rounded-full border-4 border-blue-600/40 border-b-transparent animate-spin duration-2000 reverse"></div>
        
        {/* نقطة مركزية */}
        <div className="absolute inset-10 rounded-full bg-blue-600"></div>
        
        {/* أيقونة تحميل بسيطة */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      </div>

      {/* شريط التقدم مع تصميم محسن */}
      <div className="w-72 h-2.5 bg-gray-100 rounded-full overflow-hidden mb-4 shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 transition-all duration-500 ease-out rounded-full relative"
          style={{ width: `${progress}%` }}
        >
          {/* تأثير لامع على شريط التقدم */}
          <div className="absolute top-0 left-0 w-8 h-full bg-white/30 transform -skew-x-12 animate-shine"></div>
        </div>
      </div>

      {/* النص مع رسائل أكثر وصفية */}
      <p className="text-gray-700 text-lg font-medium mb-2 transition-all duration-300">
        {progress < 20 && 'جاري تهيئة النظام...'}
        {progress >= 20 && progress < 40 && 'جاري تحميل المحتوى...'}
        {progress >= 40 && progress < 60 && 'جاري معالجة البيانات...'}
        {progress >= 60 && progress < 80 && 'جاري تجهيز الواجهة...'}
        {progress >= 80 && progress < 100 && 'جاري الانتهاء...'}
        {progress >= 100 && 'تم التحميل بنجاح!'}
      </p>

      {/* النسبة المئوية بتصميم أكثر وضوحًا */}
      <div className="flex items-center justify-center">
        <span className="text-blue-700 font-bold text-2xl">
          {Math.round(progress)}%
        </span>
      </div>

      {/* رسالة تظهر عند اكتمال التحميل */}
      {progress >= 100 && (
        <div className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg animate-fadeIn">
          جاهز للاستخدام!
        </div>
      )}

      {/* الجسيمات المتحركة المعدلة */}
      {[...Array(12)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-blue-300/40 to-blue-500/40"
          style={{
            width: `${Math.random() * 12 + 8}px`,
            height: `${Math.random() * 12 + 8}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 4 + 3}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
            opacity: 0.7
          }}
        ></div>
      ))}

      {/* تعريفات الـ Animations المعدلة */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          to { transform: rotate(-360deg); }
        }
        @keyframes float {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.7; }
          50% { transform: translateY(-40px) translateX(20px) scale(0.8); opacity: 0.4; }
          100% { transform: translateY(-80px) translateX(-20px) scale(0.6); opacity: 0; }
        }
        @keyframes shine {
          0% { left: -20%; }
          100% { left: 120%; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-spin {
          animation: spin 1.5s linear infinite;
        }
        .animate-spin.reverse {
          animation: spin-reverse 2s linear infinite;
        }
        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default PureCSSLoader