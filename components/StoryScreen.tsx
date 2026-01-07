
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Gender } from '../types';

interface StoryScreenProps {
  username: string;
  gender: Gender;
  onNext: () => void;
}

const StoryScreen: React.FC<StoryScreenProps> = ({ username, gender, onNext }) => {
  const [kitchenImageUrl, setKitchenImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateKitchen = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = "A joyful 2D cartoon kitchen, bright warm colors, culinary equipment, artistic style.";
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image', // استخدام النموذج الأسرع والأكثر توفراً
          contents: { parts: [{ text: prompt }] }
        });
        
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setKitchenImageUrl(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      } catch (e) { 
        console.warn("AI Visuals skipped - using placeholder icons.");
        setKitchenImageUrl(null);
      } finally { 
        setLoading(false); 
      }
    };
    generateKitchen();
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto">
      <div className="p-8 text-center">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-orange-600 text-xl animate-pulse">يتم تجهيز المطبخ السحري...</p>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in duration-700 max-w-lg mx-auto">
            <div className="relative mb-8 rounded-[40px] overflow-hidden shadow-2xl border-8 border-orange-50 transform -rotate-1 min-h-[200px] flex items-center justify-center bg-orange-50">
              {kitchenImageUrl ? (
                <img src={kitchenImageUrl} alt="Kitchen" className="w-full aspect-video object-cover" />
              ) : (
                <div className="text-9xl py-12">👨‍🍳🍳</div>
              )}
            </div>
            
            <h2 className="text-3xl font-black text-orange-600 mb-4">
              مرحباً بك يا {gender === 'boy' ? 'بطل النحو' : 'بطلة النحو'}!
            </h2>
            
            <div className="bg-orange-50 p-8 rounded-[35px] border-2 border-orange-100 text-xl leading-relaxed text-slate-700 font-bold mb-8 shadow-inner">
              <p>
                أنت يا <span className="text-orange-600">{username}</span> في مطبخ "الهامبورجر الخطير". مهمتك هي فتح الأدراج العشرة وجمع المكونات من خلال حل الألغاز النحوية الممتعة.
              </p>
            </div>

            <button
              onClick={onNext}
              className="w-full py-6 bg-orange-500 text-white font-black text-3xl rounded-[30px] shadow-xl hover:bg-orange-600 active:scale-95 transition-all"
            >
              افتح الأدراج الآن! 🗝️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryScreen;
