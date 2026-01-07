
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
  completedCount: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  const [groupedUsers, setGroupedUsers] = useState<Record<Difficulty, RankedUser[]>>({
    BEGINNER: [],
    INTERMEDIATE: [],
    ADVANCED: []
  });
  const [activeTab, setActiveTab] = useState<Difficulty>('BEGINNER');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGlobalData = async () => {
      setLoading(true);
      const users = await cloudService.fetchAllUsers();
      
      const allRanked: RankedUser[] = Object.entries(users)
        .map(([name, data]: [string, any]) => ({
          name,
          score: data.progress?.totalScore || 0,
          gender: data.gender || 'boy',
          difficulty: data.difficulty || 'BEGINNER',
          completedCount: data.progress?.completedStations?.length || 0
        }))
        // الشرط: لا يظهر إلا من أنهى محطة واحدة على الأقل
        .filter(u => u.completedCount > 0);

      // تقسيم المستخدمين حسب المستوى وترتيبهم حسب النقاط
      const groups: Record<Difficulty, RankedUser[]> = {
        BEGINNER: allRanked.filter(u => u.difficulty === 'BEGINNER').sort((a, b) => b.score - a.score),
        INTERMEDIATE: allRanked.filter(u => u.difficulty === 'INTERMEDIATE').sort((a, b) => b.score - a.score),
        ADVANCED: allRanked.filter(u => u.difficulty === 'ADVANCED').sort((a, b) => b.score - a.score)
      };

      setGroupedUsers(groups);
      setLoading(false);
    };
    loadGlobalData();
  }, []);

  const currentList = groupedUsers[activeTab];

  const tabs: { id: Difficulty; label: string; icon: string }[] = [
    { id: 'BEGINNER', label: 'مبتدئ', icon: '🌱' },
    { id: 'INTERMEDIATE', label: 'متوسط', icon: '🍖' },
    { id: 'ADVANCED', label: 'محترف', icon: '🔥' }
  ];

  return (
    <div className="flex-1 flex flex-col bg-orange-50 overflow-hidden">
      {/* الهيدر */}
      <div className="p-6 bg-white border-b border-orange-100 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <button onClick={onBack} className="text-2xl hover:scale-110 transition-transform">🔙</button>
        <div className="text-center">
          <h2 className="text-2xl font-black text-orange-600">لوحة الشرف 🏆</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">قائمة أمهر طباخي النحو</p>
        </div>
        <div className="w-8"></div>
      </div>

      {/* أزرار التبويب للمستويات */}
      <div className="flex p-2 gap-2 bg-orange-100/50 mx-4 mt-4 rounded-2xl border border-orange-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === tab.id 
                ? 'bg-orange-500 text-white shadow-md scale-[1.02]' 
                : 'bg-transparent text-slate-500 hover:bg-orange-200/50'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* محتوى القائمة */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-orange-600 animate-pulse">جاري جلب القائمة السحابية...</p>
          </div>
        ) : currentList.length > 0 ? (
          currentList.map((user, index) => (
            <div 
              key={user.name + index} 
              className={`flex items-center gap-3 p-4 rounded-[22px] border-2 bg-white transition-all animate-in slide-in-from-bottom-4 duration-500 shadow-sm hover:shadow-md`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* الترتيب */}
              <div className={`text-xl font-black w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                index === 0 ? 'bg-yellow-400 text-white shadow-lg' : 
                index === 1 ? 'bg-slate-300 text-white' : 
                index === 2 ? 'bg-orange-300 text-white' : 'bg-slate-50 text-slate-400'
              }`}>
                {index + 1}
              </div>
              
              {/* الأيقونة */}
              <div className="text-2xl flex-shrink-0">{user.gender === 'boy' ? '👨‍🍳' : '👩‍🍳'}</div>
              
              {/* بيانات اللاعب */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black text-slate-800 truncate">{user.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    أنهى {user.completedCount} محطة
                  </span>
                </div>
              </div>
              
              {/* النقاط */}
              <div className="text-right flex-shrink-0">
                <div className="text-xl font-black text-orange-600">{user.score.toLocaleString()}</div>
                <div className="text-[8px] font-black text-slate-400">نقطة</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white/50 rounded-[40px] border-2 border-dashed border-orange-200">
            <div className="text-6xl mb-4 grayscale opacity-40">🍳</div>
            <p className="text-slate-400 font-bold px-10">
              لا يوجد طباخون في مستوى <span className="text-orange-600">"{tabs.find(t => t.id === activeTab)?.label}"</span> حالياً.. 
              أكمل أول محطة لتكون أول المنضمين!
            </p>
          </div>
        )}
      </div>
      
      {/* زر العودة */}
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
