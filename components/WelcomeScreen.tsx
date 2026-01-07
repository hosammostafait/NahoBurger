
import React, { useState, useEffect } from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
  onAbout: () => void;
  onHowToPlay: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onAbout, onHowToPlay }) => {
  const [hasKey, setHasKey] = useState(true);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    const checkKey = async () => {
      const aiStudio = (window as any).aistudio;
      const selected = await aiStudio?.hasSelectedApiKey?.();
      
      // محاولة العثور على المفتاح من مصادر مختلفة
      const envKey = process.env.API_KEY || (window as any).process?.env?.API_KEY;
      const keyExists = !!envKey || !!selected;
      
      setHasKey(keyExists);

      if (!keyExists) {
        if (!aiStudio) {
          setDebugInfo("يجب ضبط API_KEY في إعدادات Netlify ليعمل الصوت.");
        } else {
          setDebugInfo("يرجى الضغط على زر التفعيل واختيار المفتاح.");
        }
      }
    };
    checkKey();
  }, []);

  const handleEnableAI = async () => {
    const aiStudio = (window as any).aistudio;
    
    if (aiStudio?.openSelectKey) {
      try {
        await aiStudio.openSelectKey();
        setHasKey(true);
      } catch (err) {
        console.error("Selection Error:", err);
      }
    } else {
      // رسالة توضيحية بناءً على الصورة التي أرسلتها
      alert("⚠️ تنبيه هام:\n\nلقد أظهرت الصورة أنك وضعت المفتاح كـ 'اسم' بدلاً من 'قيمة'.\n\nللإصلاح:\n1. في Netlify اجعل الاسم: API_KEY\n2. اجعل القيمة: الكود الذي يبدأ بـ AIzaSy\n3. اضغط Trigger Deploy مع Clear Cache.\n\nبدون هذه الخطوات، لن يعمل الذكاء الاصطناعي خارج بيئة AI Studio.");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-orange-50 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-10 -right-10 w-40 h-40 bg-orange-200 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-10 -left-10 w-40 h-40 bg-yellow-200 rounded-full blur-3xl opacity-50"></div>
      
      <button 
        onClick={onAbout}
        className="absolute top-6 left-6 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-orange-500 hover:scale-110 transition-transform font-bold border border-orange-100 z-50"
      >
        ℹ️
      </button>

      <div className="z-10 animate-bounce mb-8">
        <span className="text-8xl">🍔</span>
      </div>
      
      <h1 className="text-5xl font-black text-orange-600 mb-4 drop-shadow-sm">
        الهامبورجر <span className="text-yellow-600">الخطير</span>
      </h1>
      
      <div className="text-xl text-slate-600 mb-12 font-bold leading-relaxed max-w-sm">
        <p>اجمع المكونات لتصنع الهامبورجر المثالي!</p>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-xs mb-12 z-20">
        {!hasKey && (
          <button 
            onClick={handleEnableAI}
            className="group relative px-8 py-4 bg-yellow-400 text-orange-900 font-black text-lg rounded-2xl shadow-lg border-2 border-yellow-500 hover:bg-yellow-500 transition-all flex items-center justify-center gap-2 animate-pulse"
          >
            <span>🔑</span>
            تفعيل الذكاء الاصطناعي
          </button>
        )}

        <button 
          onClick={onStart}
          className="group relative px-12 py-5 bg-orange-500 text-white font-bold text-2xl rounded-2xl shadow-xl shadow-orange-200 hover:bg-orange-600 active:scale-95 transition-all"
        >
          ابدأ الرحلة 🚀
        </button>

        <button 
          onClick={onHowToPlay}
          className="px-8 py-3 bg-white text-orange-600 border-2 border-orange-100 font-black text-lg rounded-2xl shadow-md hover:bg-orange-50 transition-all"
        >
          📖 كيفية اللعب؟
        </button>
      </div>
      
      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        {!hasKey && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 text-[10px] font-bold">
            <p>🚫 {debugInfo}</p>
          </div>
        )}
        <div className="bg-white/60 w-full px-4 py-2 rounded-2xl border border-orange-100 shadow-sm text-slate-600 font-black text-[13px]">
          <span>3 مستويات احترافية 📶</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
