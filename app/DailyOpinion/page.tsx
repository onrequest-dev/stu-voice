// app/daily-opinion/page.tsx

import { redirect, notFound } from "next/navigation";

// 🧠 معلومات الوصول إلى REST API في Supabase
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_KEY!;

const DailyOpinionPage = async () => {
  // 🧠 استخدم REST API من Supabase
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/daily_opinoin_ids?select=daily_opinoin_id&order=created_at.desc&limit=1`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: 86400 },
    }
  );


  if (!res.ok) {
    notFound(); // ❌ خطأ في الاتصال
  }

  const data = await res.json();

  if (!data || data.length === 0 || !data[0].daily_opinoin_id) {
    notFound(); // ❌ لا توجد بيانات
  }

  const dailyOpinionId = data[0].daily_opinoin_id;
  redirect(`/talk/${dailyOpinionId}`);
};

export default DailyOpinionPage;
