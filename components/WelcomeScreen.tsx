
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-orange-50 overflow-hidden relative">
      {/* Decorative burger elements */}
      <div className="absolute top-10 -right-10 w-40 h-40 bg-orange-200 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-10 -left-10 w-40 h-40 bg-yellow-200 rounded-full blur-3xl opacity-50"></div>
      
      <div className="z-10 animate-bounce mb-8">
        <span className="text-8xl">🍔</span>
      </div>
      
      <h1 className="text-5xl font-black text-orange-600 mb-4 drop-shadow-sm">
        الهامبورجر <span className="text-yellow-600">الخطير</span>
      </h1>
      
      <p className="text-xl text-slate-600 mb-12 font-medium leading-relaxed max-w-xs">
        رحلتك الممتعة لاحتراف النحو العربي. <br/>
        كل محطة هي قطعة هامبورجر، <br/>
        اجمعهم لتصنع الساندويتش المثالي!
      </p>
      
      <button 
        onClick={onStart}
        className="group relative px-12 py-5 bg-orange-500 text-white font-bold text-2xl rounded-2xl shadow-xl shadow-orange-200 hover:bg-orange-600 active:scale-95 transition-all"
      >
        ابدأ الرحلة 🚀
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-orange-900 text-sm px-2 py-1 rounded-lg font-black rotate-12 group-hover:rotate-0 transition-transform">
          مجاناً!
        </div>
      </button>
      
      <div className="mt-16 text-slate-400 text-sm font-bold flex items-center gap-2">
        <span>✅ 10 مستويات</span>
        <span>•</span>
        <span>✅ 100 سؤال</span>
        <span>•</span>
        <span>✅ إعراب كامل</span>
      </div>
    </div>
  );
};

export default WelcomeScreen;
