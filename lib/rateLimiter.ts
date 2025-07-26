const RATE_LIMIT_WINDOW = 60 * 1000; // 1 دقيقة
const MAX_REQUESTS = 25;
const MAX_CACHE_SIZE = 300;

interface RateLimitEntry {
  count: number;
  expiresAt: number;
}

const rateLimitCache = new Map<string, RateLimitEntry>();

let cleanupInterval = RATE_LIMIT_WINDOW * 5; // الافتراضي أطول فترة تنظيف
let cleanupTimer: NodeJS.Timeout | null = null;
let lastIntervalLevel = 0;

// تشغيل دالة تنظيف العناصر المنتهية حسب عدد الإدخالات، لكن يتم استدعاؤها من خارج دالة rateLimiter فقط
function adjustCleanupInterval() {
  const activeEntries = rateLimitCache.size;
  let newLevel = 0;

  if (activeEntries > 50) newLevel = 3;
  else if (activeEntries > 10) newLevel = 2;
  else newLevel = 1;

  if (newLevel === lastIntervalLevel) return; // لا تعيد ضبط نفس الفترة

  lastIntervalLevel = newLevel;

  if (cleanupTimer) clearInterval(cleanupTimer);

  if (newLevel === 3) cleanupInterval = RATE_LIMIT_WINDOW;
  else if (newLevel === 2) cleanupInterval = RATE_LIMIT_WINDOW * 2;
  else cleanupInterval = RATE_LIMIT_WINDOW * 5;

  cleanupTimer = setInterval(() => {
    const now = Date.now();
    // حذف الإدخالات منتهية الصلاحية
    rateLimitCache.forEach((entry, ip) => {
      if (entry.expiresAt <= now) {
        rateLimitCache.delete(ip);
      }
    });
  }, cleanupInterval);
}

// ننشئ مؤقت التنظيف عند بداية تشغيل الكود
adjustCleanupInterval();

export function rateLimiter(ip: string): { allowed: boolean; ttl: number } {
  const now = Date.now();

  let current = rateLimitCache.get(ip);

  // حذف الإدخال إذا انتهى صلاحيته وتحديث المتغير current
  if (current && current.expiresAt <= now) {
    rateLimitCache.delete(ip);
    current = undefined;
  }

  if (current) {
    if (current.count >= MAX_REQUESTS) {
      return { allowed: false, ttl: Math.max((current.expiresAt - now) / 1000, 0) };
    } else {
      // تحديث العدّاد بنفس صلاحية الإدخال
      rateLimitCache.set(ip, { count: current.count + 1, expiresAt: current.expiresAt });
    }
  } else {
    // إذا وصلنا للسعة القصوى نحذف أقدم إدخال من حيث وقت الانتهاء (ليس المفتاح الأول بالضرورة)
    if (rateLimitCache.size >= MAX_CACHE_SIZE) {
      let oldestKey: string | undefined;
      let oldestExpiresAt = Infinity;
      rateLimitCache.forEach((entry, key) => {
        if (entry.expiresAt < oldestExpiresAt) {
          oldestExpiresAt = entry.expiresAt;
          oldestKey = key;
        }
      });
      if (oldestKey) {
        rateLimitCache.delete(oldestKey);
      }
    }
    rateLimitCache.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW });
  }

  // يمكن استدعاؤها أقل تواترًا مثلاً كل 10 عمليات أو وقت معين (هنا بسيطة تناديها دائمًا)
  adjustCleanupInterval();

  return { allowed: true, ttl: 0 };
}
