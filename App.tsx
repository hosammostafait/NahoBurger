
import React, { useState, useEffect } from 'react';
import { getStationsByDifficulty } from './data/questions';
import { Screen, Progress, Station, Gender, QuizAttempt, Difficulty } from './types';
import { cloudService } from './services/cloudDb';
import MapScreen from './components/MapScreen';
import QuizEngine from './components/QuizEngine';
import ResultScreen from './components/ResultScreen';
import LoginScreen from './components/LoginScreen';
import StoryScreen from './components/StoryScreen';
import FinalScreen from './components/FinalScreen';
import Leaderboard from './components/Leaderboard';
import MemoryGame from './components/MemoryGame';
import GuessNumber from './components/GuessNumber';
import WordSearch from './components/WordSearch';
import ReportScreen from './components/ReportScreen';
import LessonIntro from './components/LessonIntro';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('LOGIN');
  const [username, setUsername] = useState<string>('');
  const [gender, setGender] = useState<Gender>('boy');
  const [difficulty, setDifficulty] = useState<Difficulty>('BEGINNER');
  const [activeStation, setActiveStation] = useState<Station | null>(null);
  const [lastQuizResult, setLastQuizResult] = useState<{ score: number; total: number } | null>(null);
  const [progress, setProgress] = useState<Progress>({ completedStations: [], totalScore: 0 });
  const [history, setHistory] = useState<QuizAttempt[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<'online' | 'offline' | 'error'>('online');

  const currentStations = getStationsByDifficulty(difficulty);

  const handleLogin = async (name: string, userGender: Gender, userDiff: Difficulty) => {
    setIsSyncing(true);
    try {
      const cloudData = await cloudService.fetchUser(name);
      if (cloudData) {
        setUsername(name);
        setGender(cloudData.gender);
        setDifficulty(cloudData.difficulty || userDiff);
        setProgress(cloudData.progress);
        setHistory(cloudData.history || []);
        setCurrentScreen('MAP');
        setCloudStatus('online');
      } else {
        setUsername(name);
        setGender(userGender);
        setDifficulty(userDiff);
        const initialProgress = { completedStations: [], totalScore: 0 };
        setProgress(initialProgress);
        setHistory([]);
        await cloudService.saveUser(name, { gender: userGender, difficulty: userDiff, progress: initialProgress, history: [] });
        setCurrentScreen('STORY');
      }
    } catch (e) {
      setCloudStatus('offline');
      setUsername(name);
      setGender(userGender);
      setDifficulty(userDiff);
      setCurrentScreen('MAP');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (username) {
      const sync = async () => {
        setIsSyncing(true);
        const success = await cloudService.saveUser(username, { gender, difficulty, progress, history });
        setCloudStatus(success ? 'online' : 'error');
        setTimeout(() => setIsSyncing(false), 800);
      };
      sync();
    }
  }, [progress, history]);

  const selectStation = (stationId: number) => {
    const canUnlock = stationId === 1 || progress.completedStations.includes(stationId - 1);
    if (canUnlock) {
      const station = currentStations.find(s => s.id === stationId);
      if (station) {
        setActiveStation(station);
        setCurrentScreen('LESSON_INTRO');
      }
    }
  };

  const handleQuizComplete = (score: number, stationHistory: QuizAttempt[]) => {
    if (!activeStation) return;
    setLastQuizResult({ score, total: 100 });
    setHistory(prev => [...prev, ...stationHistory]);
    const isAlreadyCompleted = progress.completedStations.includes(activeStation.id);
    const newCompleted = isAlreadyCompleted ? progress.completedStations : [...progress.completedStations, activeStation.id];
    const newTotalScore = progress.totalScore + (isAlreadyCompleted ? 0 : score);
    setProgress({ completedStations: newCompleted, totalScore: newTotalScore });
    setCurrentScreen('RESULT');
  };

  const handleNextSteps = () => {
    if (!activeStation) return;
    const sid = activeStation.id;
    setActiveStation(null);
    if (sid === 3) setCurrentScreen('MEMORY_GAME');
    else if (sid === 6) setCurrentScreen('GUESS_NUMBER');
    else if (sid === 9) setCurrentScreen('WORD_SEARCH');
    else if (progress.completedStations.length === currentStations.length) setCurrentScreen('FINAL');
    else setCurrentScreen('MAP');
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto flex flex-col shadow-2xl bg-white border-x border-orange-100 relative">
      {username && (
        <div className="absolute top-4 left-4 z-[100] flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded-full text-[9px] font-black flex items-center gap-2 shadow-md transition-all border ${
            cloudStatus === 'online' ? 'bg-white border-green-200 text-green-600' : 'bg-white border-orange-200 text-orange-600'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isSyncing ? 'animate-pulse bg-blue-500' : cloudStatus === 'online' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
            {isSyncing ? 'جاري الحفظ...' : cloudStatus === 'online' ? 'تم الحفظ في فايربيز ✨' : 'حفظ محلي فقط'}
          </div>
        </div>
      )}

      {currentScreen === 'LOGIN' && <LoginScreen onLogin={handleLogin} onViewLeaderboard={() => setCurrentScreen('LEADERBOARD')} />}
      {currentScreen === 'STORY' && <StoryScreen username={username} gender={gender} onNext={() => setCurrentScreen('MAP')} />}
      {currentScreen === 'LEADERBOARD' && <Leaderboard onBack={() => username ? (progress.completedStations.length === currentStations.length ? setCurrentScreen('FINAL') : setCurrentScreen('MAP')) : setCurrentScreen('LOGIN')} />}
      {currentScreen === 'MEMORY_GAME' && <MemoryGame onComplete={() => setCurrentScreen('MAP')} />}
      {currentScreen === 'GUESS_NUMBER' && <GuessNumber onComplete={() => setCurrentScreen('MAP')} />}
      {currentScreen === 'WORD_SEARCH' && <WordSearch onComplete={() => setCurrentScreen('MAP')} />}
      {currentScreen === 'REPORT' && <ReportScreen history={history} onBack={() => setCurrentScreen('FINAL')} />}
      {currentScreen === 'LESSON_INTRO' && activeStation && <LessonIntro station={activeStation} gender={gender} onStart={() => setCurrentScreen('QUIZ')} />}
      {currentScreen === 'MAP' && (
        <>
          <div className="bg-slate-800 text-white px-4 py-2 flex justify-between items-center text-[10px] font-bold">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">{username} ({difficulty === 'BEGINNER' ? 'مبتدئ' : difficulty === 'INTERMEDIATE' ? 'متوسط' : 'محترف'})</span>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setCurrentScreen('LEADERBOARD')} className="text-yellow-400">🏆 المتصدرون</button>
              <button onClick={() => window.location.reload()} className="text-orange-300">خروج ←</button>
            </div>
          </div>
          <MapScreen stations={currentStations} progress={progress} onSelectStation={selectStation} />
        </>
      )}
      {currentScreen === 'QUIZ' && activeStation && <QuizEngine station={activeStation} onComplete={handleQuizComplete} onBack={() => setCurrentScreen('MAP')} />}
      {currentScreen === 'RESULT' && activeStation && lastQuizResult && <ResultScreen score={lastQuizResult.score} station={activeStation} onContinue={handleNextSteps} />}
      {currentScreen === 'FINAL' && <FinalScreen username={username} gender={gender} onViewLeaderboard={() => setCurrentScreen('LEADERBOARD')} onViewReport={() => setCurrentScreen('REPORT')} onReset={() => window.location.reload()} />}
    </div>
  );
};

export default App;
