// app/privacy-policy/page.tsx
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">سياسة الخصوصية</h1>
          <p className="mt-2 text-lg text-gray-600">آخر تحديث: {new Date().toLocaleDateString('ar-SA')}</p>
        </div>

        <div className="prose prose-lg max-w-none" dir="rtl">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">مقدمة</h2>
            <p className="text-gray-700 mb-4">
              ترحب منصة StuVoice بكم وتقدّر خصوصيتكم. تشرح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحماية معلوماتكم الشخصية عند استخدامكم لمنصتنا.
            </p>
            <p className="text-gray-700">
              باستخدامكم لمنصتنا، فإنكم توافقون على ممارسات جمع واستخدام المعلومات كما هو موضح في سياسة الخصوصية هذه.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">المعلومات التي نجمعها</h2>
            <h3 className="text-xl font-medium text-gray-700 mb-2">المعلومات التي تقدمها لنا:</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>معلومات الحساب (اسم المستخدم وكلمة المرور)</li>
              <li>معلومات الاتصال (البريد الإلكتروني عند الحاجة)</li>
              <li>المحتوى الذي تنشره على المنصة</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-700 mb-2">المعلومات التي نجمعها تلقائياً:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>معلومات الجهاز والمتصفح</li>
              <li>سجل النشاط على المنصة</li>
              <li>بصمة الجهاز لأغراض الأمان</li>
              <li>عنوان IP والمعلومات الجغرافية التقريبية</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">كيف نستخدم معلوماتك</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>توفير الخدمات المطلوبة وتحسين تجربة المستخدم</li>
              <li>الحفاظ على أمان المنصة وحماية حقوق المستخدمين</li>
              <li>الرد على استفساراتك وطلباتك</li>
              <li>إرسال إشعارات مهمة حول التغييرات في خدماتنا</li>
              <li>أغراض تحليلية لتحسين جودة الخدمة</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">حماية المعلومات</h2>
            <p className="text-gray-700 mb-4">
              نستخدم إجراءات أمان تقنية وإدارية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التسرب أو التلف أو الفقدان.
            </p>
            <p className="text-gray-700">
              ومع ذلك، لا يمكن ضمان أمان كامل لأي معلومات تنتقل عبر الإنترنت، ولا يمكننا ضمان الأمان المطلق للمعلومات التي ن收集ها.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">مشاركة المعلومات</h2>
            <p className="text-gray-700 mb-4">
              نحن لا نبيع أو نؤجر أو نتبادل معلوماتك الشخصية مع أطراف ثالثة لأغراض تسويقية. قد نشارك معلوماتك مع:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>مزودي الخدمات الذين يعملون نيابة عننا والذين التزموا بمعايير السرية</li>
              <li>السلطات القانونية عند الالتزام بالمتطلبات القانونية</li>
              <li>في حالات اندماج أو استحواذ على الشركة</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">حقوقك</h2>
            <p className="text-gray-700 mb-4">
              لديك الحق في الوصول إلى معلوماتك الشخصية وتصحيحها أو حذفها أو تقييد معالجتها. يمكنك أيضًا الاعتراض على معالجة معلوماتك الشخصية أو طلب نقلها.
            </p>
            <p className="text-gray-700">
              ل ممارسة هذه الحقوق، يرجى الاتصال بنا عبر معلومات الاتصال المذكورة أدناه.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">التغييرات على سياسة الخصوصية</h2>
            <p className="text-gray-700">
              قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنخطركم بأي تغييرات جوهرية عن طريق نشر الإشعار على موقعنا الإلكتروني أو إرسال إشعار مباشر إليكم. ننصحكم بمراجعة هذه السياسة بشكل دوري لأي تغييرات.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">اتصل بنا</h2>
            <p className="text-gray-700">
              إذا كان لديك أي أسئلة أو استفسارات حول سياسة الخصوصية هذه، يرجى الاتصال بنا على:
            </p>
            <p className="text-gray-700 mt-2">
              البريد الإلكتروني: privacy@stuvoice.example.com
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600">© {new Date().getFullYear()} StuVoice. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;