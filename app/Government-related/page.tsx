import ThreeDImageRotator from "@/components/Government/ThreeDImageRotator";
import Tabs from "@/components/Government/Tabs";
const HomePage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* الخلفية مع اللون + النقوش */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#166534", // نفس bg-green-800
          backgroundImage: `
            radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* رأس الموقع */}
      <header className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-3 backdrop-blur-sm z-30 bg-transparent mt-2">
        {/* اللوغو الدوار (يسار) */}
        <div className="flex-shrink-0">
          <ThreeDImageRotator />
        </div>

        {/* النص (يمين) */}
        <h1 className="from-yellow-400 to-yellow-600 bg-gradient-to-r text-transparent bg-clip-text text-lg md:text-2xl font-bold">
          وزارة التعليم العالي والبحث العلمي
        </h1>
      </header>
      {/* المحتوى الأساسي (يمكنك تعديله لاحقاً) */}
    <main className="relative z-10 mt-20">
      <Tabs />
    </main>
    </div>
  );
};

export default HomePage;