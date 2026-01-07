
import React, { useState } from 'react';
import { Gender, Difficulty } from '../types';

interface LoginScreenProps {
  onLogin: (username: string, gender: Gender, difficulty: Difficulty) => void;
  onViewLeaderboard: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onViewLeaderboard }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length >= 2 && gender && difficulty) {
      setIsLoading(true);
      await onLogin(name.trim(), gender, difficulty);
      // التحميل يتم في الـ App Component ولكننا نظهر الـ UI هنا
    }
  };

  const difficulties: { id: Difficulty; label: string; icon: string; color: string }[] = [
    { id: 'BEGINNER', label: 'مبتدئ', icon: '🌱', color: 'bg-green-50 text-green-700 border-green-200' },
    { id: 'INTERMEDIATE', label: 'متوسط', icon: '🍖', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'ADVANCED', label: 'محترف', icon: '🔥', color: 'bg-red-50 text-red-700 border-red-200' },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-orange-50 to-white overflow-y-auto relative">
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-60"></div>
      
      <div className="z-10 w-full max-w-sm py-10">
        <div className="text-center mb-10">
          <div className="text-7xl mb-4 animate-bounce">🍔</div>
          <h1 className="text-4xl font-black text-slate-800 mb-2">الهامبورجر الخطير</h1>
          <p className="text-slate-500 font-bold">رحلة احتراف النحو العربي</p>
          <div className="mt-2 inline-flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            <span className="text-[10px] font-black text-orange-700 uppercase tracking-widest">تخزين سحابي عالمي 🌐</span>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-6 animate-in fade-in zoom-in">
            <div className="w-20 h-20 border-8 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-center">
              <p className="text-xl font-black text-orange-600">جاري البحث عن حسابك...</p>
              <p className="text-sm font-bold text-slate-400 mt-1">يتم جلب بيانات التقدم من السحاب</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اكتب اسمك هنا..."
                className="w-full px-6 py-5 bg-white border-4 border-orange-100 rounded-[25px] text-xl font-bold text-slate-700 focus:border-orange-400 focus:outline-none transition-all shadow-inner text-center"
                required
              />
              <p className="text-[10px] text-center text-slate-400 font-bold mt-2">استخدم نفس الاسم في أي جهاز لاسترجاع تقدمك</p>
            </div>

            <div className="space-y-3">
              <p className="text-center font-black text-slate-400 text-sm">اختر شخصيتك</p>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setGender('boy')}
                  className={`flex-1 p-4 rounded-2xl border-4 transition-all flex flex-col items-center gap-2 ${gender === 'boy' ? 'border-orange-400 bg-orange-50 scale-105 shadow-md' : 'border-slate-100 bg-white opacity-60'}`}
                >
                  <span className="text-4xl">👦</span>
                  <span className="font-bold">ولد</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGender('girl')}
                  className={`flex-1 p-4 rounded-2xl border-4 transition-all flex flex-col items-center gap-2 ${gender === 'girl' ? 'border-orange-400 bg-orange-50 scale-105 shadow-md' : 'border-slate-100 bg-white opacity-60'}`}
                >
                  <span className="text-4xl">👧</span>
                  <span className="font-bold">بنت</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-center font-black text-slate-400 text-sm">اختر مستوى التحدي</p>
              <div className="grid grid-cols-3 gap-2">
                {difficulties.map((diff) => (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => setDifficulty(diff.id)}
                    className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-xs font-black ${difficulty === diff.id ? 'border-orange-500 ring-2 ring-orange-100 scale-105 ' + diff.color : 'border-slate-100 bg-white text-slate-400 opacity-60'}`}
                  >
                    <span className="text-xl mb-1">{diff.icon}</span>
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={name.trim().length < 2 || !gender || !difficulty}
              className={`w-full py-5 rounded-[25px] font-black text-2xl shadow-xl transition-all active:scale-95 ${
                name.trim().length >= 2 && gender && difficulty
                  ? 'bg-orange-500 text-white shadow-orange-200 hover:bg-orange-600'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              {gender === 'girl' ? 'ابدئي الطبخ 🍳' : 'ابدأ الطبخ 🍳'}
            </button>
          </form>
        )}

        <button 
          onClick={onViewLeaderboard}
          className="w-full mt-6 py-3 text-orange-600 font-black flex items-center justify-center gap-2 hover:bg-orange-50 rounded-2xl transition-all"
        >
          🏆 قائمة أمهر الطباخين
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
