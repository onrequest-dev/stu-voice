/**
 * تستخرج أسماء المستخدمين المذكورين (المنشنات) من نص التعليق.
 * @param content نص التعليق
 * @returns مصفوفة أسماء المستخدمين بدون علامة @ مكررة
 */
export function extractMentions(content: string): string[] {
  // تعبير منتظم يبحث عن الكلمات التي تبدأ بـ @ ثم أحرف وأرقام و_ فقط (يمكن تعديلها حسب اسم المستخدم)
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;
  
  const mentions = new Set<string>();
  let match;
  
  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.add(match[1]);
  }
  
  return Array.from(mentions);
}
