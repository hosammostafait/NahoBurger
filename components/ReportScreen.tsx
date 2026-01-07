
import React from 'react';
import { QuizAttempt } from '../types';

interface ReportScreenProps {
  history: QuizAttempt[];
  onBack: () => void;
}

const ReportScreen: React.FC<ReportScreenProps> = ({ history, onBack }) => {
  const correctCount = history.filter(h => h.isCorrect).length;
  const totalCount = history.length;
  const scorePercent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  // Group by topic to find weak areas
  const topicStats = history.reduce((acc, curr) => {
    if (!acc[curr.topic]) acc[curr.topic] = { correct: 0, total: 0 };
    acc[curr.topic].total += 1;
    if (curr.isCorrect) acc[curr.topic].correct += 1;
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  // Added explicit typing to Object.entries callback to resolve 'unknown' type property access errors on line 24
  const recommendations = Object.entries(topicStats)
    .filter(([_, stats]: [string, { correct: number; total: number }]) => (stats.correct / stats.total) < 0.7)
    .map(([topic]) => topic);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <div className="p-6 bg-white border-b border-orange-100 flex items-center justify-between sticky top-0 z-20">
        <button onClick={onBack} className="text-xl">🔙</button>
        <h2 className="text-2xl font-black text-slate-800">تقرير الأداء النهائي 📋</h2>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
        {/* Overview Card */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[40px] p-8 text-white shadow-xl">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-orange-100 font-bold opacity-80 mb-1">نسبة النجاح الكلية</p>
              <h3 className="text-5xl font-black">{scorePercent}%</h3>
            </div>
            <div className="text-right">
              <p className="text-4xl">🎯</p>
              <p className="text-sm font-black mt-2">{correctCount} من أصل {totalCount}</p>
            </div>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white transition-all duration-1000" style={{ width: `${scorePercent}%` }}></div>
          </div>
        </div>

        {/* Weak Areas / Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-[35px] p-6 shadow-sm">
            <h4 className="text-yellow-800 font-black text-lg mb-4 flex items-center gap-2">
              <span>💡</span> دروس تحتاج لمراجعة:
            </h4>
            <div className="flex flex-wrap gap-2">
              {recommendations.map(topic => (
                <span key={topic} className="bg-white px-4 py-2 rounded-2xl text-xs font-black text-yellow-700 border border-yellow-100 shadow-sm">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Attempts */}
        <div className="space-y-4">
          <h4 className="text-slate-800 font-black text-xl px-2">تفاصيل الأسئلة:</h4>
          {history.length > 0 ? (
            history.map((attempt, i) => (
              <div key={i} className={`bg-white rounded-[30px] p-6 border-2 transition-all hover:shadow-md ${attempt.isCorrect ? 'border-green-100' : 'border-red-100'}`}>
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${attempt.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {attempt.isCorrect ? 'صحيحة' : 'غير صحيحة'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{attempt.topic}</span>
                </div>
                <h5 className="font-black text-slate-800 text-lg mb-4">{attempt.questionText}</h5>
                {!attempt.isCorrect && (
                  <div className="mb-4 text-sm font-bold flex flex-col gap-1">
                    <p className="text-red-500">إجابتك: {attempt.userAnswer}</p>
                    <p className="text-green-600">الإجابة الصحيحة: {attempt.correctAnswer}</p>
                  </div>
                )}
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-xs text-slate-500 font-bold leading-relaxed italic">
                    <span className="text-orange-500">الشرح:</span> {attempt.explanation}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400 font-bold">لم تكتمل أي تحديات بعد.</div>
          )}
        </div>
      </div>

      <div className="p-6 bg-white border-t border-slate-100 absolute bottom-0 left-0 right-0 z-30">
        <button onClick={onBack} className="w-full py-5 bg-orange-500 text-white font-black text-xl rounded-3xl shadow-lg hover:bg-orange-600 active:scale-95 transition-all">
          فهمت، شكراً! 👋
        </button>
      </div>
    </div>
  );
};

export default ReportScreen;
