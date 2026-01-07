
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
    <div className="flex-1 flex flex-col bg-[#fffbf5] relative pb-40 overflow-y-auto overflow-x-hidden">
      {/* هيدر الخريطة */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-xl p-5 border-b border-orange-100 flex justify-between items-center z-50">
        <div>
          <h2 className="text-2xl font-black text-orange-600">رحلة المكونات</h2>
          <p className="text-[10px] font-bold text-slate-400">تتبع المسار لجمع الهامبورجر</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-orange-50 border-2 border-orange-200 px-4 py-1.5 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] font-black text-orange-400 uppercase">النقاط</span>
            <span className="text-lg font-black text-orange-700">⭐ {progress.totalScore}</span>
          </div>
        </div>
      </div>

      <div className="relative mt-12 px-10 flex flex-col items-center">
        {/* رسم المسار المتعرج خلف الأزرار */}
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
            strokeDasharray="5, 15"
            strokeLinecap="round"
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
                className={`flex items-center w-full transition-all duration-700 ${isRight ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* الدرج التفاعلي */}
                <div className="w-1/2 flex justify-center">
                  <button
                    onClick={() => onSelectStation(station.id)}
                    disabled={!isUnlocked}
                    className={`
                      relative group w-32 h-32 rounded-3xl border-b-[8px] border-r-4 transition-all duration-300 flex flex-col items-center justify-center
                      ${isUnlocked 
                        ? 'bg-gradient-to-br from-[#d2691e] to-[#8b4513] border-[#5d2e0d] shadow-2xl hover:scale-110 active:translate-y-2 active:border-b-4' 
                        : 'bg-slate-300 border-slate-400 opacity-60 cursor-not-allowed'}
                      ${isCurrent ? 'ring-8 ring-yellow-400/40 ring-offset-4 ring-offset-[#fffbf5]' : ''}
                      ${isCompleted ? 'brightness-110 ring-4 ring-green-400/30' : ''}
                    `}
                  >
                    {/* مقبض الدرج */}
                    <div className={`w-12 h-3 rounded-full mb-3 shadow-inner ${isUnlocked ? 'bg-yellow-600' : 'bg-slate-500'}`}></div>
                    
                    <span className={`text-5xl transition-all duration-500 ${isCurrent ? 'animate-bounce scale-125' : ''}`}>
                      {isCompleted ? ingredientIcon : isUnlocked ? '🗝️' : '🔒'}
                    </span>

                    {/* علامة اكتمال الدرج */}
                    {isCompleted && (
                      <div className="absolute -top-3 -right-3 w-9 h-9 bg-green-500 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg animate-in zoom-in">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                    )}
                  </button>
                </div>

                {/* وصف المحطة */}
                <div className={`w-1/2 px-4 ${isRight ? 'text-right' : 'text-left'}`}>
                  <div className={`p-4 rounded-3xl transition-all ${isCurrent ? 'bg-orange-100/50 shadow-sm border border-orange-200' : ''}`}>
                    <span className={`text-[11px] font-black uppercase tracking-tighter ${isUnlocked ? 'text-orange-600' : 'text-slate-400'}`}>
                      المستوى {station.id}
                    </span>
                    <h3 className={`text-lg font-black leading-tight mt-1 ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                      {station.title}
                    </h3>
                    {isUnlocked && (
                      <p className="text-[10px] font-bold text-slate-500 mt-1">المكون: {ingredientIcon} {station.description}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* خط النهاية والمائدة */}
        <div className="mt-32 mb-20 flex flex-col items-center">
          <div className={`
            w-48 h-48 rounded-full border-8 border-dashed flex flex-col items-center justify-center transition-all duration-1000
            ${progress.completedStations.length === stations.length ? 'bg-yellow-400 border-orange-600 scale-125 shadow-2xl' : 'bg-white border-slate-200 opacity-40'}
          `}>
             <span className="text-8xl">🍔</span>
          </div>
          <p className="mt-6 font-black text-slate-400 text-center max-w-xs">
            {progress.completedStations.length === stations.length 
              ? "لقد وصلت للمأدبة الكبرى! استمتع بصنع الهامبورجر!" 
              : "اجمع كل المكونات من الأدراج لتصل إلى المائدة الكبرى"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapScreen;
