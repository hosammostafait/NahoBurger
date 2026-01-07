
import React, { useState, useEffect } from 'react';

interface GuessNumberProps {
  onComplete: () => void;
}

const GuessNumber: React.FC<GuessNumberProps> = ({ onComplete }) => {
  const [target, setTarget] = useState(0);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('اختر رقماً بين 1 و 20');
  const [attempts, setAttempts] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    setTarget(Math.floor(Math.random() * 20) + 1);
  }, []);

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(guess);
    if (isNaN(num)) return;

    setAttempts(prev => prev + 1);
    if (num === target) {
      setMessage(`أحسنت! الرقم هو ${target} فعلاً! ✨`);
      setWon(true);
      setTimeout(onComplete, 2000);
    } else if (num < target) {
      setMessage('أممم.. الرقم أكبر من ذلك! 📈');
    } else {
      setMessage('أوووه.. الرقم أصغر من ذلك! 📉');
    }
    setGuess('');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 p-8 items-center justify-center text-center">
      <div className="bg-white p-10 rounded-[50px] shadow-2xl border-4 border-orange-100 max-w-sm w-full">
        <div className="text-6xl mb-6">👨‍🍳</div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">رقم الشيف السري</h2>
        <p className="text-slate-400 font-bold mb-8">خمن درجة حرارة الفرن السرية!</p>

        <div className={`p-4 rounded-2xl mb-8 font-black text-lg transition-all ${won ? 'bg-green-100 text-green-700' : 'bg-orange-50 text-orange-600'}`}>
          {message}
        </div>

        {!won && (
          <form onSubmit={handleGuess} className="space-y-4">
            <input
              type="number"
              min="1"
              max="20"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="w-full text-center text-4xl font-black py-4 border-4 border-slate-100 rounded-3xl focus:border-orange-400 outline-none transition-all"
              placeholder="?"
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-5 bg-orange-500 text-white font-black text-xl rounded-3xl shadow-lg hover:bg-orange-600 active:scale-95 transition-all"
            >
              تحقق من الرقم 🧐
            </button>
          </form>
        )}

        <div className="mt-8 text-xs font-black text-slate-300 uppercase tracking-widest">
          المحاولات: {attempts}
        </div>
      </div>
    </div>
  );
};

export default GuessNumber;
