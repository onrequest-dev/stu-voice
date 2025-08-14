export function handelreactionInStorage(
  key: string,            // اسم الكائن (مثلاً "reactions")
  id: string,             // معرف المنشور
  type: string,           // نوع التفاعل (مثلاً "agree")
  action: 'set' | 'remove'  // هل تريد الإضافة أم الإزالة
) {
  const existing = JSON.parse(localStorage.getItem(key) || "[]");

  let updated = existing.filter(
    (item: any) => !(item.id === id && item.type === type)
  );

  if (action === 'set') {
    updated.push({ id, type });
  }

  localStorage.setItem(key, JSON.stringify(updated));
}