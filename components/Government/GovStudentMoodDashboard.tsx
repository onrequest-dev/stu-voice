import React from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts'
import { motion } from 'framer-motion'
import { FiMessageSquare, FiAlertTriangle, FiRefreshCw, FiPieChart } from 'react-icons/fi'

// GovStudentMoodDashboard.improved.tsx
// مكون React (TSX) مُحسّن: تصميم حديث، متجاوب، أنيق، وملائم للشاشات الصغيرة والكبيرة
// يعتمد Tailwind CSS + Recharts + react-icons + framer-motion

type Summary = {
  opinions: number
  complaints: number
  repeatedIssues: number
  agreeSurveys: number
  disagreeSurveys: number
}

type TrendPoint = { date: string; moodScore: number; inquiries: number }

type Issue = { title: string; count: number }

type Props = {
  summary?: Summary
  trend?: TrendPoint[]
  categoryBreakdown?: { name: string; value: number }[]
  topIssues?: Issue[]
  percent?:number
}

const GOLD = '#D4AF37'
const GREEN = '#2F855A'
const RED = '#E05353'

export default function GovStudentMoodDashboard({
  summary = {
    opinions: 4820,
    complaints: 342,
    repeatedIssues: 58,
    agreeSurveys: 900,
    disagreeSurveys: 700,
  },
  trend = [
    { date: '2025-08-25', moodScore: 62, inquiries: 120 },
    { date: '2025-08-26', moodScore: 58, inquiries: 180 },
    { date: '2025-08-27', moodScore: 55, inquiries: 200 },
    { date: '2025-08-28', moodScore: 61, inquiries: 140 },
    { date: '2025-08-29', moodScore: 67, inquiries: 100 },
    { date: '2025-08-30', moodScore: 70, inquiries: 90 },
    { date: '2025-08-31', moodScore: 66, inquiries: 130 },
  ],
  categoryBreakdown = [
    { name: 'آراء', value: 4820 },
    { name: 'شكاوى', value: 342 },
    { name: 'مشكلات مكررة', value: 58 },
  ],
  topIssues = [
    { title: 'مشكلة في الدفع الإلكتروني', count: 120 },
    { title: 'تأخير في إصدار الشهادات', count: 80 },
    { title: 'صعوبة الوصول إلى النظام', count: 60 },
  ],percent = 75,
}: Props) {
  const totalSurveys = summary.agreeSurveys + summary.disagreeSurveys
  const pieData = [
    { name: 'متفق', value: summary.agreeSurveys },
    { name: 'معارض', value: summary.disagreeSurveys },
  ]
  const pieColors = [GREEN, RED]
  const totalItems = summary.opinions + summary.complaints + summary.repeatedIssues

  return (
    <section dir="rtl" aria-labelledby="dashboard-title" className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-6"
        >
          <div>
            <h2 id="dashboard-title" className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
              لوحة الإحصائيات
            </h2>
          </div>
        </motion.header>

        {/* Main layout: summary + charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Summary cards row */}
          <div className="col-span-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="عدد الآراء" value={summary.opinions} accent={GOLD} Icon={FiMessageSquare} />
              <StatCard title="عدد الشكاوى" value={summary.complaints} accent={RED} Icon={FiAlertTriangle} />
              <StatCard title="المشكلات المكررة" value={summary.repeatedIssues} accent="#F59E0B" Icon={FiRefreshCw} />
              <StatCard
                title={`الاستطلاعات (موافق/معارض)`}
                value={`${summary.agreeSurveys} / ${summary.disagreeSurveys}`}
                accent={GREEN}
                Icon={FiPieChart}
                sub={`إجمالي: ${totalSurveys}`}
              />
            </div>
          </div>

          {/* Charts area */}
          <div className="col-span-12 lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.995 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-white/60 via-white/50 to-white/30 rounded-2xl p-4 shadow-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-md md:text-lg font-medium text-gray-800">اتجاه المزاج والاستفسارات</h3>
                <div className="text-sm text-gray-500">نظرة آخر 7 أيام</div>
              </div>

              <div style={{ height: 340 }} className="-mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradMood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={GOLD} stopOpacity={0.28} />
                        <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.6} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" domain={[40, 100]} tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 18px rgba(0,0,0,0.08)' }}
                      wrapperStyle={{ zIndex: 50 }}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="moodScore"
                      stroke={GOLD}
                      strokeWidth={2}
                      fill="url(#gradMood)"
                      name="مؤشر المزاج"
                    />
                    <Bar yAxisId="right" dataKey="inquiries" barSize={18} fill={GREEN} name="عدد الاستعلامات" radius={[6, 6, 0, 0]} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <MiniStat label="معدل المزاج" value={`${Math.round(trend.reduce((s, p) => s + p.moodScore, 0) / trend.length)}%`} color={GOLD} />
                <MiniStat label="إجمالي الاستعلامات" value={`${trend.reduce((s, p) => s + p.inquiries, 0)}`} color={GREEN} />
                <MiniStat label="نسبة الشكاوى" value={`${Math.round((summary.complaints / Math.max(1, totalItems)) * 100)}%`} color={RED} />
              </div>
            </motion.div>
          </div>

          {/* Right column: breakdown + pie + top issues */}
          <aside className="col-span-12 lg:col-span-4 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-white/60 rounded-2xl p-4 shadow-md"
            >
              <h4 className="text-sm font-medium text-gray-800 mb-2">نسب التوافق على القرارات</h4>
              <div className="w-full h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      startAngle={90}
                      endAngle={-270}
                      innerRadius={40}
                      outerRadius={64}
                      paddingAngle={4}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>تفصيل</span>
                  <span className="font-semibold">إجمالي: {totalSurveys}</span>
                </div>
                <div className="space-y-2">
                  {pieData.map((p) => (
                    <div key={p.name} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ background: p.name === 'متفق' ? GREEN : RED }} />
                        <div className="text-sm">{p.name}</div>
                      </div>
                      <div className="text-sm font-medium">{p.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.06 }}
              className="bg-white/60 rounded-2xl p-4 shadow-md"
            >
              <h4 className="text-sm font-medium text-gray-800 mb-3">تفاصيل المشكلات الأكثر تكراراً</h4>
              <ul className="divide-y divide-gray-200">
                {topIssues.map((it, idx) => (
                  <li key={idx} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{it.title}</div>
                      <div className="text-xs text-gray-500">تكرار: {it.count}</div>
                    </div>
                    <div className="text-sm font-medium text-gray-700">{it.count}</div>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="bg-white/60 rounded-2xl p-4 shadow-md"
            >
              <h4 className="text-sm font-medium text-gray-800 mb-3">تفصيل الفئات</h4>
              <div className="space-y-3">
                {categoryBreakdown.map((c) => (
                  <div key={c.name} className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{c.name}</div>
                      <div className="text-xs text-gray-500">{Math.round((c.value / Math.max(1, totalItems)) * 100)}% من الإجمالي</div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mt-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${Math.round((c.value / Math.max(1, totalItems)) * 100)}%`, background: c.name === 'آراء' ? GOLD : c.name === 'شكاوى' ? RED : '#F59E0B' }}
                        />
                      </div>
                    </div>
                    <div className="w-20 text-left font-semibold">{c.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </section>
  )
}

/* ---------- Helper subcomponents ---------- */

function StatCard({ title, value, accent, sub, Icon }: { title: string; value: React.ReactNode; accent: string; sub?: string; Icon: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/70 rounded-xl p-3 sm:p-4 shadow-sm flex items-center gap-3"
    >
      <div className="p-2 rounded-lg flex items-center justify-center" style={{ background: `${accent}22` }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: accent }}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="flex-1 text-right">
        <div className="text-xs text-gray-600">{title}</div>
        <div className="text-lg sm:text-xl font-semibold text-gray-800">{value}</div>
        {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
      </div>
    </motion.div>
  )
}

function MiniStat({ label, value, color }: { label: string; value: React.ReactNode; color: string }) {
  return (
    <div className="bg-white/80 rounded-lg p-3 flex items-center justify-between">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-semibold" style={{ color }}>{value}</div>
    </div>
  )
}

function Badge({ label, accent }: { label: string; accent: string }) {
  return (
    <div className="inline-flex items-center gap-3 px-3 py-2 rounded-full bg-white/70 shadow-sm">
      <span className="w-3 h-3 rounded-full" style={{ background: accent }} />
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  )
}
