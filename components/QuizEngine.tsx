
import React, { useState, useEffect } from 'react';
import { Station, Question, QuizAttempt } from '../types';

interface QuizEngineProps {
  station: Station;
  onComplete: (score: number, history: QuizAttempt[]) => void;
  onBack: () => void;
}

interface ShuffledOption {
  text: string;
  originalIndex: number;
}

const QuizEngine: React.FC<QuizEngineProps> = ({ station, onComplete, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<ShuffledOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  const currentQuestion = station.questions[currentIndex];

  // Shuffles options whenever the current question index changes
  useEffect(() => {
    const optionsWithIndices = currentQuestion.options.map((text, index) => ({
      text,
      originalIndex: index
    }));
    
    // Shuffling using Math.random
    const shuffled = [...optionsWithIndices].sort(() => Math.random() - 0.5);
    setShuffledOptions(shuffled);
  }, [currentIndex, currentQuestion]);

  const handleOptionClick = (shuffledIdx: number) => {
    if (isAnswered) return;
    
    const originalIdx = shuffledOptions[shuffledIdx].originalIndex;
    setSelectedOption(shuffledIdx);
    setIsAnswered(true);
    
    const isCorrect = originalIdx === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 10);
    }

    const attempt: QuizAttempt = {
      stationId: station.id,
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      isCorrect: isCorrect,
      userAnswer: shuffledOptions[shuffledIdx].text,
      correctAnswer: currentQuestion.options[currentQuestion.correctAnswer],
      explanation: currentQuestion.explanation,
      topic: station.title
    };

    setAttempts(prev => [...prev, attempt]);
  };

  const nextQuestion = () => {
    if (currentIndex < station.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onComplete(score, attempts);
    }
  };

  const progress = ((currentIndex + 1) / station.questions.length) * 100;

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-orange-100 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-orange-50 text-slate-500"
        >
          ✕
        </button>
        <div className="text-center px-2">
          <p className="text-xs font-black text-orange-500 line-clamp-1">{station.title}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">سؤال {currentIndex + 1} من {station.questions.length}</p>
        </div>
        <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center font-black text-yellow-700 text-sm">
          {score}
        </div>
      </div>

      <div className="h-2 w-full bg-slate-100 relative overflow-hidden">
        <div 
          className="h-full bg-orange-500 transition-all duration-700 ease-out relative shadow-[0_0_15px_rgba(249,115,22,0.6)]"
          style={{ width: `${progress}%` }}
        >
          {/* Subtle shine animation overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" 
            style={{ backgroundSize: '200% 100%', width: '100%', height: '100%' }}
          ></div>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col overflow-y-auto">
        <div className="mb-8">
          <h3 className="text-2xl font-black text-slate-800 leading-snug">
            {currentQuestion.text}
          </h3>
        </div>

        <div className="space-y-3 flex-1">
          {shuffledOptions.map((option, index) => {
            let stateStyle = "border-slate-100 hover:border-orange-200 hover:bg-orange-50";
            if (isAnswered) {
              const isOptionCorrect = option.originalIndex === currentQuestion.correctAnswer;
              const isOptionSelected = index === selectedOption;
              
              if (isOptionCorrect) {
                stateStyle = "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-100";
              } else if (isOptionSelected) {
                stateStyle = "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-100";
              } else {
                stateStyle = "border-slate-50 opacity-50";
              }
            } else if (selectedOption === index) {
              stateStyle = "border-orange-500 bg-orange-50 ring-2 ring-orange-100";
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={isAnswered}
                className={`w-full p-4 text-right rounded-2xl border-2 font-bold text-lg transition-all duration-200 flex items-center gap-3 ${stateStyle}`}
              >
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black opacity-50">
                  {['أ', 'ب', 'ج', 'د'][index]}
                </span>
                {option.text}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className={`mt-6 p-5 rounded-3xl animate-in slide-in-from-bottom-2 fade-in duration-300 ${shuffledOptions[selectedOption!].originalIndex === currentQuestion.correctAnswer ? 'bg-green-50/50 border-2 border-green-100' : 'bg-red-50/50 border-2 border-red-100'}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{shuffledOptions[selectedOption!].originalIndex === currentQuestion.correctAnswer ? '✅' : '❌'}</span>
              <div>
                <p className={`font-black ${shuffledOptions[selectedOption!].originalIndex === currentQuestion.correctAnswer ? 'text-green-700' : 'text-red-700'}`}>
                  {shuffledOptions[selectedOption!].originalIndex === currentQuestion.correctAnswer ? 'إجابة عبقرية!' : 'إجابة غير دقيقة..'}
                </p>
                <p className="text-xs text-slate-600 font-bold mt-1 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-100">
        <button
          onClick={nextQuestion}
          disabled={!isAnswered}
          className={`w-full py-5 rounded-2xl font-black text-xl transition-all ${
            isAnswered 
              ? 'bg-orange-500 text-white shadow-xl shadow-orange-100 hover:bg-orange-600' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          {currentIndex === station.questions.length - 1 ? 'إنهاء التحدي' : 'السؤال التالي ←'}
        </button>
      </div>
    </div>
  );
};

export default QuizEngine;
