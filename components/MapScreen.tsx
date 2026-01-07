
import React from 'react';
import { Station, Progress } from '../types';

interface MapScreenProps {
  stations: Station[];
  progress: Progress;
  onSelectStation: (id: number) => void;
}

const MapScreen: React.FC<MapScreenProps> = ({ stations, progress, onSelectStation }) => {
  // أيقونات المكونات لكل درج بالترتيب
  const ingredientIcons = ['🥯', '🥗', '🍅', '🧅', '🧀', '🥩', '🥒', '🥫', '🍟', '🍞'];

  return (
    <div className="flex-1 flex flex-col bg-[#fffbf5] relative pb-40 overflow-y-auto overflow-x-hidden scroll-smooth">
      {/* هيدر الخريطة */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-xl p-5 border-b border-orange-100 flex justify-between items-center z-50 shadow-sm">
        <div className="animate-in fade-in slide-in-from-top-2 duration-500">
          <h2 className="text-2xl font-black text-orange-600">رحلة المكونات</h2>
          <p className="text-[10px] font-bold text-slate-400">تتبع المسار لجمع الهامبورجر</p>
        </div>
        <div className="flex gap-2 animate-in fade-in zoom-in duration-700 delay-200">
          <div className="bg-orange-50 border-2 border-orange-200 px-4 py-1.5 rounded-2xl flex flex-col items-center shadow-sm">
            <span className="text-[10px] font-black text-orange-400 uppercase">النقاط</span>
            <span className="text-lg font-black text-orange-700">⭐ {progress.totalScore}</span>
          </div>
        </div>
      </div>

      <div className="relative mt-12 px-10 flex flex-col items-center">
        {/* رسم المسار المتعرج خلف الأزرار مع تأثير نبضي */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20" style={{ minHeight: '1800px' }}>
          <path
            d={`M ${window.innerWidth / 2} 40 ${stations.map((_, i) => {
              const y = i * 180 + 40;
              const x = (window.innerWidth / 2) + (i % 2 === 0 ? 80 : -80);
              const nextY = (i + 1) * 180 + 40;
              const nextX = (window.innerWidth / 2) + ((i + 1) % 2 === 0 ? 80 : -80);
              return `C ${x} ${y + 90}, ${nextX} ${nextY - 90}, ${nextX} ${nextY}`;
            }).slice(0, -1).join(' ')}`}
            fill="none"
            stroke="#d2691e"
            strokeWidth="12"
            strokeDasharray="10, 20"
            strokeLinecap="round"
            className="animate-[shimmer_20s_linear_infinite]"
          />
        </svg>

        {/* محطات الأدراج */}
        <div className="relative z-10 space-y-24 w-full">
          {stations.map((station, index) => {
            const isCompleted = progress.completedStations.includes(station.id);
            const isUnlocked = station.id === 1 || progress.completedStations.includes(station.id - 1);
            const isCurrent = isUnlocked && !isCompleted;
            const isRight = index % 2 !== 0;
            const ingredientIcon = ingredientIcons[index];

            return (
              <div 
                key={station.id} 
                className={`flex items-center w-full transition-all duration-1000 animate-in fade-in slide-in-from-bottom-8 ${isRight ? 'flex-row-reverse' : 'flex-row'}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* الدرج التفاعلي */}
                <div className="w-1/2 flex justify-center">
                  <div className="relative">
                    {/* هالة مضيئة خلف المحطة الحالية */}
                    {isCurrent && (
                      <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-2xl animate-pulse scale-150"></div>
                    )}
                    
                    <button
                      onClick={() => onSelectStation(station.id)}
                      disabled={!isUnlocked}
                      className={`
                        relative group w-32 h-32 rounded-[32px] border-b-[10px] border-r-4 transition-all duration-300 flex flex-col items-center justify-center
                        ${isUnlocked 
                          ? 'bg-gradient-to-br from-[#d2691e] to-[#8b4513] border-[#5d2e0d] shadow-2xl hover:scale-110 hover:-translate-y-2 hover:shadow-orange-900/40 active:translate-y-2 active:border-b-4' 
                          : 'bg-slate-300 border-slate-400 opacity-60 cursor-not-allowed'}
                        ${isCurrent ? 'ring-8 ring-yellow-400/40 ring-offset-4 ring-offset-[#fffbf5] animate-bounce' : ''}
                        ${isCompleted ? 'brightness-110 ring-4 ring-green-400/30' : ''}
                      `}
                    >
                      {/* مقبض الدرج */}
                      <div className={`w-12 h-3 rounded-full mb-3 shadow-inner transition-colors duration-500 ${isUnlocked ? 'bg-yellow-600 group-hover:bg-yellow-400' : 'bg-slate-500'}`}></div>
                      
                      <span className={`text-5xl transition-all duration-500 group-hover:rotate-12 ${isCurrent ? 'scale-125' : ''}`}>
                        {isCompleted ? ingredientIcon : isUnlocked ? '🗝️' : '🔒'}
                      </span>

                      {/* شعاع ضوئي عند التحويم */}
                      {isUnlocked && (
                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]"></div>
                      )}

                      {/* علامة اكتمال الدرج */}
                      {isCompleted && (
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-green-500 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-xl animate-in zoom-in duration-500 delay-300">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* وصف المحطة */}
                <div className={`w-1/2 px-4 ${isRight ? 'text-right' : 'text-left'}`}>
                  <div className={`p-4 rounded-3xl transition-all duration-500 ${isCurrent ? 'bg-orange-100/60 shadow-md border border-orange-200 scale-105' : 'hover:bg-slate-100/50'}`}>
                    <span className={`text-[11px] font-black uppercase tracking-tighter transition-colors ${isUnlocked ? 'text-orange-600' : 'text-slate-400'}`}>
                      المستوى {station.id}
                    </span>
                    <h3 className={`text-lg font-black leading-tight mt-1 transition-colors ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                      {station.title}
                    </h3>
                    {isUnlocked && (
                      <p className="text-[10px] font-bold text-slate-500 mt-1 animate-in fade-in duration-1000">المكون: {ingredientIcon} {station.description}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* خط النهاية والمائدة مع تأثيرات احتفالية */}
        <div className="mt-32 mb-20 flex flex-col items-center animate-in fade-in duration-1000 delay-1000">
          <div className={`
            w-56 h-56 rounded-full border-8 border-dashed flex flex-col items-center justify-center transition-all duration-1000
            ${progress.completedStations.length === stations.length 
              ? 'bg-yellow-400 border-orange-600 scale-110 shadow-[0_0_50px_rgba(251,191,36,0.5)] animate-bounce' 
              : 'bg-white border-slate-200 opacity-40'}
          `}>
             <span className={`text-8xl transition-transform duration-1000 ${progress.completedStations.length === stations.length ? 'scale-125' : 'grayscale'}`}>🍔</span>
          </div>
          <p className={`mt-8 font-black text-center max-w-xs transition-all duration-500 ${progress.completedStations.length === stations.length ? 'text-orange-600 scale-110' : 'text-slate-400'}`}>
            {progress.completedStations.length === stations.length 
              ? "يا للروعة! لقد اكتمل الهامبورجر العظيم! 🏆" 
              : "اجمع كل المكونات من الأدراج لتصل إلى المائدة الكبرى"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapScreen;
