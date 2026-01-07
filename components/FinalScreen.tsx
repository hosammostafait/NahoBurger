
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Gender } from '../types';

interface FinalScreenProps {
  username: string;
  gender: Gender;
  onViewLeaderboard: () => void;
  onViewReport: () => void;
  onReset: () => void;
}

const FinalScreen: React.FC<FinalScreenProps> = ({ username, gender, onViewLeaderboard, onViewReport, onReset }) => {
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateFinal = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const isBoy = gender === 'boy';
        const prompt = `A joyful high-quality cartoon style scene in a kitchen. A happy ${isBoy ? 'boy' : 'girl'} is sitting at a wooden table, enthusiastically assembling a giant, multi-layered delicious hamburger with all ingredients. Celebration atmosphere.`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: prompt }] }
        });
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) setFinalImageUrl(`data:image/png;base64,${part.inlineData.data}`);
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    generateFinal();
  }, [gender]);

  return (
    <div className="flex-1 flex flex-col bg-orange-50 items-center justify-center p-8 text-center overflow-y-auto">
      {loading ? (
        <div className="flex flex-col items-center gap-6">
          <div className="text-8xl animate-bounce">🍔</div>
          <p className="text-2xl font-black text-orange-600">جارٍ إعداد مأدبة النحو الكبرى...</p>
        </div>
      ) : (
        <div className="animate-in zoom-in duration-1000 max-w-md w-full py-10">
          <h2 className="text-4xl font-black text-slate-800 mb-2">تهانينا يا {username}!</h2>
          <p className="text-orange-600 font-bold mb-8 text-xl">لقد صنعت الهامبورجر العظيم!</p>
          
          <div className="rounded-[40px] overflow-hidden shadow-2xl border-8 border-white mb-10 transform rotate-2">
            {finalImageUrl ? (
              <img src={finalImageUrl} alt="Success" className="w-full" />
            ) : (
              <div className="w-full aspect-square bg-white flex items-center justify-center text-9xl">🥳</div>
            )}
          </div>

          <div className="space-y-4">
            <button
              onClick={onViewReport}
              className="w-full py-5 bg-white text-slate-800 font-black text-xl rounded-3xl shadow-xl border-2 border-orange-100 hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              📊 تقرير الأداء والمراجعة
            </button>
            <button
              onClick={onViewLeaderboard}
              className="w-full py-5 bg-yellow-400 text-orange-900 font-black text-2xl rounded-3xl shadow-xl hover:bg-yellow-500 transition-all active:scale-95"
            >
              🏆 عرض قائمة الشرف
            </button>
            <button
              onClick={onReset}
              className="w-full py-5 bg-slate-800 text-white font-black text-2xl rounded-3xl shadow-xl hover:bg-slate-900 transition-all active:scale-95"
            >
              العودة للبداية 🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalScreen;
