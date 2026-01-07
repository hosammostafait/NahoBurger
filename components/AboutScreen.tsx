
import React from 'react';

interface AboutScreenProps {
  onBack: () => void;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ onBack }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-orange-50 text-center overflow-y-auto relative">
      <div className="absolute top-10 right-10 text-6xl opacity-10 rotate-12">🍔</div>
      <div className="absolute bottom-10 left-10 text-6xl opacity-10 -rotate-12">👨‍🍳</div>

      <div className="bg-white p-10 rounded-[45px] shadow-2xl border-4 border-orange-100 max-w-sm w-full animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center text-4xl mb-6 mx-auto shadow-lg text-white font-black">
          ℹ️
        </div>
        
        <h2 className="text-3xl font-black text-slate-800 mb-6">عن التطبيق</h2>
        
        <div className="space-y-6 text-lg leading-relaxed font-bold text-slate-600">
          <p>
            هذا التطبيق من تطوير <br/>
            <a 
              href="https://www.facebook.com/HosamMostafaEbrahem/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-700 underline decoration-orange-200 decoration-4 underline-offset-4 transition-colors"
            >
              حسام مصطفى إبراهيم
            </a>
          </p>
          
          <p>
            لصالح <br/>
            <a 
              href="https://www.facebook.com/profile.php?id=61571836268146" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-yellow-600 hover:text-yellow-700 underline decoration-yellow-200 decoration-4 underline-offset-4 transition-colors"
            >
              مبادرة الذكاء الاصطناعي ببساطة
            </a>
          </p>
          
          <div className="pt-6 border-t border-slate-100 text-sm text-slate-400">
            جميع الحقوق محفوظة 2026 ©
          </div>
        </div>

        <button 
          onClick={onBack}
          className="mt-10 w-full py-4 bg-slate-800 text-white font-black rounded-2xl shadow-lg hover:bg-slate-900 active:scale-95 transition-all"
        >
          العودة ←
        </button>
      </div>
    </div>
  );
};

export default AboutScreen;
