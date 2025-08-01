'use client';
import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

interface Opinion {
  id: string;
  text: string;
  type: 'ترفيهي' | 'أكاديمي' | 'اجتماعي';
  createdAt: Date;
  expiresAt: Date;
}

const STUvoiceOpinionManager = () => {
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [currentOpinion, setCurrentOpinion] = useState<Opinion | null>(null);
  const [newOpinion, setNewOpinion] = useState({
    text: '',
    type: 'أكاديمي' as 'ترفيهي' | 'أكاديمي' | 'اجتماعي'
  });
  const [timeLeft, setTimeLeft] = useState('');

  // تحميل الآراء المحفوظة
  useEffect(() => {
    const savedOpinions = localStorage.getItem('stuvoice-opinions');
    if (savedOpinions) {
      const parsedOpinions = JSON.parse(savedOpinions).map((op: any) => ({
        ...op,
        createdAt: new Date(op.createdAt),
        expiresAt: new Date(op.expiresAt)
      }));
      setOpinions(parsedOpinions);
    }
  }, []);

  // إدارة الرأي الحالي والوقت المتبقي
  useEffect(() => {
    if (opinions.length === 0) return;

    const updateCurrentOpinion = () => {
      const now = new Date();
      const activeOpinion = opinions.find(op => 
        now >= new Date(op.createdAt) && now <= new Date(op.expiresAt)
      ) || opinions[0];

      setCurrentOpinion(activeOpinion);

      // حساب الوقت المتبقي
      const expireDate = new Date(activeOpinion.expiresAt);
      const diff = expireDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft('انتهى الوقت');
        return;
      }

      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`متبقي ${Math.floor(hours)} ساعة و ${Math.floor(minutes)} دقيقة`);
    };

    updateCurrentOpinion();
    const timer = setInterval(updateCurrentOpinion, 60000);

    return () => clearInterval(timer);
  }, [opinions]);

  // إضافة رأي جديد
  const addOpinion = () => {
    if (!newOpinion.text.trim()) return;

    const now = new Date();
    const nextDay = new Date(now);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(12, 0, 0, 0);

    const newOp: Opinion = {
      id: Date.now().toString(),
      text: newOpinion.text,
      type: newOpinion.type,
      createdAt: now,
      expiresAt: nextDay
    };

    const updatedOpinions = [...opinions, newOp];
    setOpinions(updatedOpinions);
    localStorage.setItem('stuvoice-opinions', JSON.stringify(updatedOpinions));
    setNewOpinion({ text: '', type: 'أكاديمي' });
  };

  // حذف رأي
  const deleteOpinion = (id: string) => {
    const updatedOpinions = opinions.filter(op => op.id !== id);
    setOpinions(updatedOpinions);
    localStorage.setItem('stuvoice-opinions', JSON.stringify(updatedOpinions));
  };

  // تنسيق التاريخ ميلادي
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* واجهة إضافة رأي جديد */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold text-blue-600 mb-4">إضافة رأي يومي جديد</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نص الرأي</label>
            <textarea
              value={newOpinion.text}
              onChange={(e) => setNewOpinion({...newOpinion, text: e.target.value})}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="أدخل نص الرأي اليومي..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نوع الرأي</label>
            <select
              value={newOpinion.type}
              onChange={(e) => setNewOpinion({...newOpinion, type: e.target.value as any})}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="أكاديمي">أكاديمي</option>
              <option value="ترفيهي">ترفيهي</option>
              <option value="اجتماعي">اجتماعي</option>
            </select>
          </div>
          
          <button
            onClick={addOpinion}
            disabled={!newOpinion.text.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            إضافة رأي
          </button>
        </div>
      </div>

      {/* عرض الرأي الحالي */}
      {currentOpinion && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-blue-600">STUvoice</h2>
            <div className="flex items-center text-sm text-gray-500">
              <FaClock className="mr-1" />
              <span>{timeLeft}</span>
            </div>
          </div>
          
          <div className="mb-3">
            <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
              currentOpinion.type === 'ترفيهي' ? 'bg-purple-100 text-purple-800' :
              currentOpinion.type === 'أكاديمي' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {currentOpinion.type}
            </span>
          </div>
          
          <p className="text-gray-800 text-right text-lg leading-relaxed">
            {currentOpinion.text}
          </p>
          
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-1" />
              <span>ينتهي في: {formatDate(new Date(currentOpinion.expiresAt))}</span>
            </div>
          </div>
        </div>
      )}

      {/* قائمة جميع الآراء */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-bold text-gray-800 mb-3">الآراء المخططة</h3>
        {opinions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">لا توجد آراء مضافة بعد</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {opinions.map((opinion) => (
              <li key={opinion.id} className="py-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-1">
                      <span className={`inline-block px-2 py-0.5 text-xs rounded-full mr-2 ${
                        opinion.type === 'ترفيهي' ? 'bg-purple-100 text-purple-800' :
                        opinion.type === 'أكاديمي' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {opinion.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(new Date(opinion.createdAt))}
                      </span>
                    </div>
                    <p className="text-gray-800">{opinion.text}</p>
                  </div>
                  <button
                    onClick={() => deleteOpinion(opinion.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    حذف
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default STUvoiceOpinionManager;