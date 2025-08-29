import React from "react";
import Image from "next/image";

const STUvoiceHomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 font-sans" dir="rtl">
      {/* الهيدر */}
      <header className="relative bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white overflow-hidden rounded-b-[3rem] shadow-2xl">
        {/* زخارف SVG ناعمة */}
        <div className="absolute inset-0 z-0">
          <svg
            className="absolute -top-32 -right-32 opacity-15 blur-2xl"
            width="600"
            height="600"
            viewBox="0 0 200 200"
          >
            <path
              fill="currentColor"
              d="M45.1,-65.3C59.1,-59.2,71.5,-48.3,77.2,-33.5C82.9,-18.7,81.9,-0.1,77.6,16.4C73.3,32.9,65.7,47.3,54.3,57.1C42.9,66.8,27.7,71.8,12.5,74.8C-2.7,77.8,-17.9,78.8,-29.8,72.5C-41.7,66.2,-50.3,52.7,-58.9,38.4C-67.5,24.1,-76,9.1,-76.2,-6.4C-76.4,-21.9,-68.3,-37.9,-56.6,-48.6C-44.9,-59.3,-29.5,-64.7,-13.6,-68.6C2.3,-72.5,4.6,-74.9,45.1,-65.3Z"
              transform="translate(100 100)"
            />
          </svg>
          <svg
            className="absolute bottom-0 left-0 opacity-20"
            width="100%"
            height="200"
            viewBox="0 0 500 200"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              d="M0,100 C150,200 350,0 500,100 L500,200 L0,200 Z"
            ></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 py-2 relative z-10 text-center">
          {/* شعار */}
          <div className="bg-transparent rounded-full inline-block">
            <Image
              src="/stu-voice.png"
              alt="STUvoice Logo"
              width={296}
              height={296}
              className="object-contain"
            />
          </div>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto mb-2">
            رأيك يصنع الفرق
          </p>
        </div>
      </header>

      {/* المحتوى */}
      <main className="container mx-auto px-6 py-10">
        {/* قسم عن المنصة */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-blue-900 mb-6">
              عن منصتنا
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="bg-white p-10 rounded-3xl shadow-xl relative">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                منصة STUvoice هي مساحة تفاعلية مبتكرة تم إنشاؤها خصيصًا للطلاب
                للتعبير عن آرائهم ومشاركة أفكارهم ومناقشة التحديات التي يواجهونها.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                نؤمن بأن صوت كل طالب مهم ويستحق أن يُسمع، ونسعى لخلق بيئة آمنة
                للحوار البنّاء بين الطلاب والمعلمين والإدارة.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                انضم إلينا اليوم وساهم في صنع فرق حقيقي في تجربتك التعليمية.
              </p>
            </div>

            {/* قيم */}
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  title: "رؤيتنا",
                  text: "أن يكون كل طالب مسموعًا ومؤثرًا.",
                  color: "from-blue-600 to-blue-800",
                },
                {
                  title: "رسالتنا",
                  text: "تمكين الطلاب من التعبير بكل حرية ومسؤولية.",
                  color: "from-blue-500 to-blue-700",
                },
                {
                  title: "قيمنا",
                  text: "الشفافية، الإبداع، المسؤولية، الاحترام.",
                  color: "from-blue-700 to-blue-900",
                },
                {
                  title: "الإطلاق",
                  text: "١ سبتمبر ٢٠٢٥",
                  color: "from-blue-500 to-blue-800",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`bg-gradient-to-br ${item.color} text-white rounded-2xl shadow-xl p-6 hover:scale-105 transition-transform`}
                >
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* روابط مهمة */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-blue-900 mb-6">
              روابط مهمة
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "سياسة الخصوصية",
                desc: "تعرف على كيفية حماية بياناتك وخصوصيتك.",
                color: "from-blue-600 to-blue-800",
                button: "اقرأ المزيد",
              },
              {
                title: "فريق المطورين",
                desc: "تعرف على الأشخاص خلف المنصة.",
                color: "from-blue-500 to-blue-700",
                button: "زيارة الموقع",
              },
              // {
              //   title: "المسؤولون",
              //   desc: "تواصل مع المسؤولين للإستفسارات والشكاوى.",
              //   color: "from-blue-700 to-blue-900",
              //   button: "عرض التفاصيل",
              // },
            ].map((card, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-3xl shadow-lg bg-white/50 backdrop-blur-lg border border-white/30 hover:scale-105 transition-transform"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-15`}
                ></div>
                <div className="relative z-10 p-8 text-center">
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">
                    {card.title}
                  </h3>
                  <p className="text-gray-700 mb-6">{card.desc}</p>
                  <button className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-900 text-white shadow-lg hover:opacity-90 transition">
                    {card.button}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* الفوتر */}
      <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-10 mt-20 rounded-t-[3rem] shadow-inner">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-200 mb-4">
            © 2025 STUvoice. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default STUvoiceHomePage;
