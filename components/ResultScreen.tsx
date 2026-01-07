
import React from 'react';
import { Station } from '../types';

interface ResultScreenProps {
  score: number;
  station: Station;
  onContinue: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ score, station, onContinue }) => {
  const isPerfect = score === 100;
  const isGood = score >= 70;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white relative overflow-hidden">
      {/* Confetti-like decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 text-4xl animate-bounce delay-75">🍟</div>
        <div className="absolute bottom-20 right-10 text-4xl animate-bounce delay-150">🍅</div>
        <div className="absolute top-40 right-20 text-4xl animate-bounce delay-300">🥗</div>
      </div>

      <div className="z-10 bg-orange-50 w-full p-10 rounded-[40px] border-4 border-dashed border-orange-200 shadow-2xl">
        <div className="text-7xl mb-6">{isPerfect ? '👑' : isGood ? '💪' : '📚'}</div>
        
        <h2 className="text-3xl font-black text-slate-800 mb-2">تم اجتياز المحطة!</h2>
        <p className="text-orange-600 font-bold mb-8">{station.title}</p>
        
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
             <div className="text-8xl font-black text-orange-500 flex items-baseline gap-1">
              <span>{score}</span>
              <span className="text-2xl text-slate-400">/ 100</span>
            </div>
          </div>
          <div className="mt-4 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-2xl ${i < Math.floor(score / 20) ? 'grayscale-0' : 'grayscale opacity-30'}`}>
                ⭐
              </span>
            ))}
          </div>
        </div>

        <p className="text-slate-500 font-medium mb-10 leading-relaxed italic">
          {isPerfect 
            ? "عبقري نحو! لقد صنعت شطيرة مثالية!" 
            : isGood 
            ? "رائع! معلوماتك قوية جداً، استمر في التقدم." 
            : "عمل جيد، لكن القليل من المراجعة سيجعلك أقوى!"}
        </p>

        <button
          onClick={onContinue}
          className="w-full py-5 bg-orange-500 text-white font-black text-2xl rounded-3xl shadow-xl shadow-orange-100 hover:bg-orange-600 active:scale-95 transition-all"
        >
          العودة للخريطة 🗺️
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
