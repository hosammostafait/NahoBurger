
import React, { useEffect, useState } from 'react';
import { cloudService } from '../services/cloudDb';

interface LeaderboardProps {
  onBack: () => void;
}

interface RankedUser {
  name: string;
  score: number;
  gender: 'boy' | 'girl';
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
          gender: data.gender || 'boy'
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 15);
      setRankedUsers(ranked);
      setLoading(false);
    };
    loadGlobalData();
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-orange-50 overflow-hidden">
      <div className="p-8 bg-white border-b border-orange-100 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="text-2xl hover:scale-110 transition-transform">🔙</button>
        <div className="text-center">
          <h2 className="text-3xl font-black text-orange-600">لوحة الشرف 🏆</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ترتيب الطباخين حول العالم 🌐</p>
        </div>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-orange-600 animate-pulse">جاري جلب قائمة الشرف العالمية...</p>
          </div>
        ) : rankedUsers.length > 0 ? (
          rankedUsers.map((user, index) => (
            <div 
              key={user.name + index} 
              className={`flex items-center gap-4 p-5 rounded-[25px] border-2 transition-all animate-in slide-in-from-bottom-4 duration-500`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`text-2xl font-black w-10 h-10 rounded-xl flex items-center justify-center ${
                index === 0 ? 'bg-yellow-400 text-white shadow-lg' : 
                index === 1 ? 'bg-slate-300 text-white' : 
                index === 2 ? 'bg-orange-300 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
              </div>
              <div className="text-3xl">{user.gender === 'boy' ? '👨‍🍳' : '👩‍🍳'}</div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-slate-800">{user.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase">رتبة الشيف المتميز</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-orange-600">{user.score}</div>
                <div className="text-[10px] font-bold text-slate-400">نقطة</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-orange-200">
            <div className="text-6xl mb-4">🍳</div>
            <p className="text-slate-400 font-bold">لا يوجد طباخون بعد.. كن أول من يسجل اسمه!</p>
          </div>
        )}
      </div>
      
      <div className="p-8 bg-white border-t border-orange-50">
        <button 
          onClick={onBack}
          className="w-full py-5 bg-orange-500 text-white font-black text-2xl rounded-3xl shadow-xl shadow-orange-100 active:scale-95 transition-all hover:bg-orange-600"
        >
          العودة للمغامرة 🗺️
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
