
import React, { useState, useEffect } from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
  onAbout: () => void;
  onHowToPlay: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onAbout, onHowToPlay }) => {
  const [hasKey, setHasKey] = useState(true);
  const [keySource, setKeySource] = useState("");

  useEffect(() => {
    const checkKey = async () => {
      const aiStudio = (window as any).aistudio;
      const selected = await aiStudio?.hasSelectedApiKey?.();
      
      // التحقق من وجود المفتاح في بيئة التشغيل
      const envKey = process.env.API_KEY;
      const keyExists = !!envKey || !!selected;
      
      setHasKey(keyExists);
      if (envKey) setKeySource("تم العثور على المفتاح في إعدادات نيتلفاي ✅");
      else if (selected) setKeySource("تم اختيار المفتاح من AI Studio ✅");
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
      alert("⚠️ للتخلص من هذه الرسالة على Netlify:\n1. تأكد من إعداد API_KEY في Environment Variables.\n2. تأكد من عمل Trigger Deploy -> Clear Cache.\n\nإذا كنت تستخدم الهاتف، جرب متصفح الكمبيوتر.");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-orange-50 overflow-hidden relative">
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
      
      <div className="text-xl text-slate-600 mb-12 font-bold max-w-sm">
        <p>اجمع المكونات لتصنع الهامبورجر المثالي!</p>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-xs mb-12 z-20">
        {!hasKey && (
          <button 
            onClick={handleEnableAI}
            className="group relative px-8 py-4 bg-yellow-400 text-orange-900 font-black text-lg rounded-2xl shadow-lg border-2 border-yellow-500 hover:bg-yellow-500 transition-all flex items-center justify-center gap-2 animate-pulse"
          >
            <span>🔑</span> تفعيل الصوت والصور
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
        {keySource && <p className="text-[10px] text-green-600 font-bold">{keySource}</p>}
        <div className="bg-white/60 w-full px-4 py-2 rounded-2xl border border-orange-100 shadow-sm text-slate-600 font-black text-[13px]">
          <span>3 مستويات احترافية 📶</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
