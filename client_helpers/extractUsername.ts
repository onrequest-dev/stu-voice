/**
 * دالة تستخرج اسم المستخدم من النص وتقسمه إلى جزئين
 * @param text النص المدخل الذي يحتوي على اسم المستخدم
 * @returns كائن يحتوي على اسم المستخدم والنص المتبقي
 */
export function extractUsername(text: string): { username: string; remainingText: string } {
  // البحث عن أول occurrence لـ @ في النص
  const atIndex = text.indexOf('@');
  
  // إذا لم يتم العثور على @ أو كانت في آخر النص
  if (atIndex === -1 || atIndex === text.length - 1) {
    return { username: '', remainingText: text };
  }
  
  // استخراج الجزء من النص بعد @
  const afterAt = text.substring(atIndex + 1);
  
  // البحث عن أول فراغ أو نزول سطر بعد @
  const separatorIndex = afterAt.search(/[\s\n]/);
  
  let username: string;
  let remainingText: string;
  
  if (separatorIndex === -1) {
    // إذا لم يكن هناك فراغ أو نزول سطر، نأخذ كل النص كاسم مستخدم
    username = text.substring(atIndex);
    remainingText = text.substring(0, atIndex);
  } else {
    // استخراج اسم المستخدم (من @ حتى الفراغ أو نزول السطر)
    username = text.substring(atIndex, atIndex + separatorIndex + 1);
    // النص المتبقي هو الجزء قبل @ وبعد اسم المستخدم
    remainingText = text.substring(0, atIndex) + afterAt.substring(separatorIndex + 1);
  }
  
  return { username: username.trim(), remainingText: remainingText.trim() };
}