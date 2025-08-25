export function handelreactionInStorage(
  key: string,               // اسم الكائن في التخزين المحلي (مثلاً "reactions")
  id: string,                // معرف العنصر (مثلاً معرف المنشور)
  type: string,              // نوع التفاعل (مثلاً "agree")
  action: 'set' | 'remove'   // نوع العملية: إضافة أو إزالة
) {
  const existing = JSON.parse(localStorage.getItem(key) || "[]");

  let updated;

  if (action === 'set') {
    // نحذف أي كائن له نفس id
    updated = existing.filter((item: any) => item.id !== id);
    // ثم نضيف الكائن الجديد
    updated.push({ id, type });
  } else {
    // نحذف الكائن الذي له نفس id و type فقط
    updated = existing.filter((item: any) => !(item.id === id && item.type === type));
  }

  localStorage.setItem(key, JSON.stringify(updated));
}
