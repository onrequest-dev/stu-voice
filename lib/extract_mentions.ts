/**
 * تستخرج أسماء المستخدمين المذكورين (المنشنات) من نص التعليق.
 * @param content نص التعليق
 * @param ignoreMentions اسم مستخدم أو مجموعة أسماء مستخدمين (بدون @) لتجاهلها (اختياري)
 * @returns مصفوفة أسماء المستخدمين بدون علامة @ ومصفاة من المكررات والمستثنيات
 */
export function extractMentions(
  content: string,
  ignoreMentions?: string | string[]
): string[] {
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;
  const mentions = new Set<string>();
  let match;

  // تحويل القيمة إلى مصفوفة حتى لو كانت سلسلة واحدة
  const ignoreSet = new Set(
    typeof ignoreMentions === "string"
      ? [ignoreMentions]
      : ignoreMentions ?? []
  );

  while ((match = mentionRegex.exec(content)) !== null) {
    const username = match[1];
    if (!ignoreSet.has(username)) {
      mentions.add(username);
    }
  }

  return Array.from(mentions);
}
