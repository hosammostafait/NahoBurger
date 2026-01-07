
import React, { useState, useEffect } from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
  onAbout: () => void;
  onHowToPlay: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onAbout, onHowToPlay }) => {
  const [hasKey, setHasKey] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      // التحقق من وجود مفتاح محقون أو مفتاح تم اختياره مسبقاً
      const selected = await (window as any).aistudio?.hasSelectedApiKey?.();
      setHasKey(!!process.env.API_KEY || !!selected);
    };
    checkKey();
  }, []);

  const handleEnableAI = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      // نفترض النجاح لاستكمال التجربة
      setHasKey(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-orange-50 overflow-hidden relative">
      {/* Decorative burger elements */}
      <div className="absolute top-10 -right-10 w-40 h-40 bg-orange-200 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-10 -left-10 w-40 h-40 bg-yellow-200 rounded-full blur-3xl opacity-50"></div>
      
      <button 
        onClick={onAbout}
        className="absolute top-6 left-6 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-orange-500 hover:scale-110 transition-transform font-bold border border-orange-100 z-50"
        title="عن التطبيق"
      >
        ℹ️
      </button>

      <div className="z-10 animate-bounce mb-8">
        <span className="text-8xl">🍔</span>
      </div>
      
      <h1 className="text-5xl font-black text-orange-600 mb-4 drop-shadow-sm">
        الهامبورجر <span className="text-yellow-600">الخطير</span>
      </h1>
      
      <div className="text-xl text-slate-600 mb-12 font-bold leading-relaxed max-w-sm space-y-2">
        <p>كل محطة تكسب مكوناً من مكونات الساندويتش الخطير.</p>
        <p className="text-orange-500">اجمعها لتصنع الهامبورجر المثالي!</p>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-xs mb-12 z-20">
        {!hasKey && (
          <button 
            onClick={handleEnableAI}
            className="group relative px-8 py-4 bg-yellow-400 text-orange-900 font-black text-lg rounded-2xl shadow-lg border-2 border-yellow-500 hover:bg-yellow-500 transition-all flex items-center justify-center gap-2 animate-pulse"
          >
            <span>🔑</span>
            تفعيل الصوت والذكاء الاصطناعي
          </button>
        )}

        <button 
          onClick={onStart}
          className="group relative px-12 py-5 bg-orange-500 text-white font-bold text-2xl rounded-2xl shadow-xl shadow-orange-200 hover:bg-orange-600 active:scale-95 transition-all"
        >
          ابدأ الرحلة 🚀
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-orange-900 text-sm px-2 py-1 rounded-lg font-black rotate-12 group-hover:rotate-0 transition-transform">
            مجاناً!
          </div>
        </button>

        <button 
          onClick={onHowToPlay}
          className="px-8 py-3 bg-white text-orange-600 border-2 border-orange-100 font-black text-lg rounded-2xl shadow-md hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
        >
          <span>📖</span>
          كيفية اللعب؟
        </button>
      </div>
      
      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        {!hasKey && (
          <p className="text-[10px] text-red-500 font-black mb-2">
            ملاحظة: يجب تفعيل المفتاح أعلاه لسماع نطق الأسئلة ورؤية الصور.
          </p>
        )}
        <div className="bg-white/60 w-full px-4 py-2 rounded-2xl border border-orange-100 shadow-sm text-slate-600 font-black text-[13px] flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <span className="text-lg">📶</span>
          <span>3 مستويات (مبتدئ، متوسط، محترف)</span>
        </div>
        
        <button 
          onClick={onAbout} 
          className="mt-6 text-orange-400 hover:text-orange-600 underline underline-offset-4 text-xs font-bold transition-colors"
        >
          عن التطبيق والمطور
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
