
import React from 'react';
import { Station, Gender } from '../types';

interface LessonIntroProps {
  station: Station;
  gender: Gender;
  onStart: () => void;
}

const LessonIntro: React.FC<LessonIntroProps> = ({ station, gender, onStart }) => {
  const isBoy = gender === 'boy';

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto">
      <div className="p-8 flex-1">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-5xl shadow-inner border-4 border-white">
            👨‍🍳
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">{station.title}</h2>
          <p className="text-orange-600 font-bold">{station.description}</p>
        </div>

        <div className="bg-orange-50 rounded-[40px] p-8 border-2 border-orange-100 shadow-sm relative mb-12">
          <div className="absolute -top-4 right-8 bg-orange-500 text-white px-6 py-1 rounded-full text-xs font-black shadow-md uppercase">
            وصفة النجاح 📝
          </div>
          
          <h3 className="text-xl font-black text-slate-800 mb-6 border-b border-orange-200 pb-2">
            {isBoy ? 'تذكرْ النقاط التالية:' : 'تذكري النقاط التالية:'}
          </h3>

          <ul className="space-y-6">
            {station.summaryPoints.map((point, index) => (
              <li key={index} className="flex gap-4 items-start group">
                <span className="w-8 h-8 rounded-xl bg-white border-2 border-orange-200 flex-shrink-0 flex items-center justify-center text-orange-600 font-black text-sm group-hover:scale-110 transition-transform">
                  {index + 1}
                </span>
                <p className="text-slate-700 font-bold leading-relaxed pt-0.5">
                  {point}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-8 bg-slate-50 border-t border-slate-100 sticky bottom-0">
        <button
          onClick={onStart}
          className="w-full py-5 bg-orange-500 text-white font-black text-2xl rounded-[25px] shadow-xl shadow-orange-100 hover:bg-orange-600 active:scale-95 transition-all"
        >
          {isBoy ? 'جاهز للتحدي! 💪' : 'جاهزة للتحدي! 💪'}
        </button>
      </div>
    </div>
  );
};

export default LessonIntro;
