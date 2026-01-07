
import React, { useEffect, useState } from 'react';
import { cloudService } from '../services/cloudDb';
import { Difficulty } from '../types';

interface LeaderboardProps {
  onBack: () => void;
}

interface RankedUser {
  name: string;
  score: number;
  gender: 'boy' | 'girl';
  difficulty: Difficulty;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  const [rankedUsers, setRankedUsers] = useState<RankedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGlobalData = async () => {
      setLoading(true);
      const users = await cloudService.fetchAllUsers();
      const ranked: RankedUser[] = Object.entries(users)
        .map(([name, data]: [string, any]) => ({
          name,
          score: data.progress?.totalScore || 0,
          gender: data.gender || 'boy',
          difficulty: data.difficulty || 'BEGINNER'
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 15);
      setRankedUsers(ranked);
      setLoading(false);
    };
    loadGlobalData();
  }, []);

  const getDifficultyLabel = (diff: Difficulty) => {
    switch(diff) {
        case 'BEGINNER': return { label: 'مبتدئ', color: 'bg-green-100 text-green-700' };
        case 'INTERMEDIATE': return { label: 'متوسط', color: 'bg-blue-100 text-blue-700' };
        case 'ADVANCED': return { label: 'محترف', color: 'bg-red-100 text-red-700' };
        default: return { label: 'مبتدئ', color: 'bg-slate-100' };
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-orange-50 overflow-hidden">
      <div className="p-8 bg-white border-b border-orange-100 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <button onClick={onBack} className="text-2xl hover:scale-110 transition-transform">🔙</button>
        <div className="text-center">
          <h2 className="text-3xl font-black text-orange-600">لوحة الشرف 🏆</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">أمهر طباخي النحو العربي</p>
        </div>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-orange-600 animate-pulse">جاري جلب قائمة الشرف...</p>
          </div>
        ) : rankedUsers.length > 0 ? (
          rankedUsers.map((user, index) => {
            const diffInfo = getDifficultyLabel(user.difficulty);
            return (
              <div 
                key={user.name + index} 
                className={`flex items-center gap-3 p-4 rounded-[22px] border-2 bg-white transition-all animate-in slide-in-from-bottom-4 duration-500 shadow-sm hover:shadow-md`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`text-xl font-black w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  index === 0 ? 'bg-yellow-400 text-white shadow-lg' : 
                  index === 1 ? 'bg-slate-300 text-white' : 
                  index === 2 ? 'bg-orange-300 text-white' : 'bg-slate-50 text-slate-400'
                }`}>
                  {index + 1}
                </div>
                
                <div className="text-2xl flex-shrink-0">{user.gender === 'boy' ? '👨‍🍳' : '👩‍🍳'}</div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black text-slate-800 truncate">{user.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${diffInfo.color}`}>
                      مستوى: {diffInfo.label}
                    </span>
                  </div>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <div className="text-xl font-black text-orange-600">{user.score.toLocaleString()}</div>
                  <div className="text-[8px] font-black text-slate-400">نقطة</div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-orange-200">
            <div className="text-6xl mb-4">🍳</div>
            <p className="text-slate-400 font-bold">لا يوجد طباخون بعد.. كن أول من يسجل اسمه!</p>
          </div>
        )}
      </div>
      
      <div className="p-6 bg-white border-t border-orange-50">
        <button 
          onClick={onBack}
          className="w-full py-4 bg-orange-500 text-white font-black text-xl rounded-2xl shadow-xl shadow-orange-100 active:scale-95 transition-all hover:bg-orange-600"
        >
          العودة للمغامرة 🗺️
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
