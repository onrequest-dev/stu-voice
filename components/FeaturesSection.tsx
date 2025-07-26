import React from 'react';
import { FaUserShield, FaComments, FaChartPie, FaBell, FaLock, FaGraduationCap, FaMobileAlt, FaGlobe } from 'react-icons/fa';

const FeaturesSection = () => {
  const features = [
    {
      icon: <FaUserShield className="w-8 h-8" />,
      title: "توثيق حسابات الطلاب",
      description: "نظام توثيق آمن لحسابات الطلاب لضمان مصداقية الآراء المقدمة"
    },
    {
      icon: <FaComments className="w-8 h-8" />,
      title: "جمع الآراء التعليمية",
      description: "منصة متكاملة لجمع آراء الطلاب حول المنظومات التعليمية المختلفة"
    },
    {
      icon: <FaChartPie className="w-8 h-8" />,
      title: "تحليل البيانات",
      description: "أدوات متقدمة لتحليل البيانات واستخراج التقارير الإحصائية"
    },
    {
      icon: <FaBell className="w-8 h-8" />,
      title: "التنبيهات المباشرة",
      description: "إشعارات فورية عند نشر استبيانات جديدة أو ظهور نتائج"
    },
    {
      icon: <FaLock className="w-8 h-8" />,
      title: "خصوصية مضمونة",
      description: "حماية كاملة لبيانات المستخدمين وضمان سرية المشاركات"
    },
    {
      icon: <FaGraduationCap className="w-8 h-8" />,
      title: "دعم العملية التعليمية",
      description: "مساهمة فعالة في تطوير البيئة التعليمية بناءً على آراء الطلاب"
    },
    {
      icon: <FaMobileAlt className="w-8 h-8" />,
      title: "واجهة متجاوبة",
      description: "تصميم متكامل يعمل على جميع الأجهزة الذكية بسهولة"
    },
    {
      icon: <FaGlobe className="w-8 h-8" />,
      title: "متاح على مدار الساعة",
      description: "خدمة متوفرة 24/7 تمكنك من المشاركة في أي وقت"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            مميزات منصة <span className="text-blue-600">STUvoice</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            نقدم لكم منصة متكاملة لجمع آراء الطلاب بطرق مبتكرة وآمنة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;