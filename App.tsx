
import React, { useState, useEffect } from 'react';
import { getStationsByDifficulty } from './data/questions';
import { Screen, Progress, Station, Gender, QuizAttempt, Difficulty } from './types';
import { cloudService } from './services/cloudDb';
import { audioService } from './services/audioService';
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
import BurgerProgress from './components/BurgerProgress';
import WelcomeScreen from './components/WelcomeScreen';
import AboutScreen from './components/AboutScreen';
import HowToPlayScreen from './components/HowToPlayScreen';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('WELCOME');
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
    audioService.playClick();
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
    if (username && currentScreen !== 'WELCOME' && currentScreen !== 'LOGIN' && currentScreen !== 'ABOUT' && currentScreen !== 'HOW_TO_PLAY') {
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
    audioService.playClick();
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
    audioService.playSuccess();
    setLastQuizResult({ score, total: 100 });
    setHistory(prev => [...prev, ...stationHistory]);
    const isAlreadyCompleted = progress.completedStations.includes(activeStation.id);
    const newCompleted = isAlreadyCompleted ? progress.completedStations : [...progress.completedStations, activeStation.id];
    const newTotalScore = progress.totalScore + (isAlreadyCompleted ? 0 : score);
    setProgress({ completedStations: newCompleted, totalScore: newTotalScore });
    setCurrentScreen('RESULT');
  };

  const handleNextSteps = () => {
    audioService.playClick();
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
      {/* مؤشر المزامنة */}
      {username && currentScreen !== 'WELCOME' && currentScreen !== 'LOGIN' && currentScreen !== 'ABOUT' && currentScreen !== 'HOW_TO_PLAY' && (
        <div className="fixed bottom-4 left-4 z-[200]">
           <div className={`p-2 rounded-full shadow-lg border-2 transition-all flex items-center justify-center bg-white ${
            cloudStatus === 'online' ? 'border-green-200' : 'border-orange-200'
          }`} title={cloudStatus === 'online' ? 'تم الحفظ سحابياً' : 'حفظ محلي'}>
            <div className={`w-3 h-3 rounded-full ${isSyncing ? 'animate-pulse bg-blue-500' : cloudStatus === 'online' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
          </div>
        </div>
      )}

      {currentScreen === 'WELCOME' && (
        <WelcomeScreen 
          onStart={() => setCurrentScreen('LOGIN')} 
          onAbout={() => setCurrentScreen('ABOUT')} 
          onHowToPlay={() => { audioService.playClick(); setCurrentScreen('HOW_TO_PLAY'); }}
        />
      )}
      {currentScreen === 'HOW_TO_PLAY' && <HowToPlayScreen onBack={() => { audioService.playClick(); setCurrentScreen('WELCOME'); }} />}
      {currentScreen === 'ABOUT' && <AboutScreen onBack={() => { audioService.playClick(); setCurrentScreen('WELCOME'); }} />}
      {currentScreen === 'LOGIN' && <LoginScreen onLogin={handleLogin} onViewLeaderboard={() => { audioService.playClick(); setCurrentScreen('LEADERBOARD'); }} onAbout={() => setCurrentScreen('ABOUT')} />}
      {currentScreen === 'STORY' && <StoryScreen username={username} gender={gender} onNext={() => { audioService.playClick(); setCurrentScreen('MAP'); }} />}
      {currentScreen === 'LEADERBOARD' && <Leaderboard onBack={() => { audioService.playClick(); username ? (progress.completedStations.length === currentStations.length ? setCurrentScreen('FINAL') : setCurrentScreen('MAP')) : setCurrentScreen('LOGIN'); }} />}
      {currentScreen === 'MEMORY_GAME' && <MemoryGame onComplete={() => { audioService.playSuccess(); setCurrentScreen('MAP'); }} />}
      {currentScreen === 'GUESS_NUMBER' && <GuessNumber onComplete={() => { audioService.playSuccess(); setCurrentScreen('MAP'); }} />}
      {currentScreen === 'WORD_SEARCH' && <WordSearch onComplete={() => { audioService.playSuccess(); setCurrentScreen('MAP'); }} />}
      {currentScreen === 'REPORT' && <ReportScreen history={history} onBack={() => { audioService.playClick(); setCurrentScreen('FINAL'); }} />}
      {currentScreen === 'LESSON_INTRO' && activeStation && <LessonIntro station={activeStation} gender={gender} onStart={() => { audioService.playClick(); setCurrentScreen('QUIZ'); }} />}
      {currentScreen === 'MAP' && (
        <>
          <div className="bg-slate-800 text-white px-4 py-3 flex justify-between items-center text-[11px] font-bold sticky top-0 z-[110] shadow-md">
            <div className="flex items-center gap-3">
              <BurgerProgress completedCount={progress.completedStations.length} totalCount={currentStations.length} />
              <div className="flex flex-col">
                 <span className="text-yellow-400">👤 {username}</span>
                 <span className="bg-slate-700 px-2 py-0.5 rounded text-[8px] w-fit mt-0.5">{difficulty === 'BEGINNER' ? 'مبتدئ' : difficulty === 'INTERMEDIATE' ? 'متوسط' : 'محترف'}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => { audioService.playClick(); setCurrentScreen('LEADERBOARD'); }} className="text-yellow-400 hover:scale-105 transition-transform flex items-center gap-1">🏆 المتصدرون</button>
              <button onClick={() => { audioService.playClick(); window.location.reload(); }} className="text-orange-300 hover:scale-105 transition-transform">خروج ←</button>
            </div>
          </div>
          <MapScreen stations={currentStations} progress={progress} onSelectStation={selectStation} />
        </>
      )}
      {currentScreen === 'QUIZ' && activeStation && <QuizEngine station={activeStation} onComplete={handleQuizComplete} onBack={() => { audioService.playClick(); setCurrentScreen('MAP'); }} />}
      {currentScreen === 'RESULT' && activeStation && lastQuizResult && <ResultScreen score={lastQuizResult.score} station={activeStation} onContinue={handleNextSteps} />}
      {currentScreen === 'FINAL' && <FinalScreen username={username} gender={gender} onViewLeaderboard={() => { audioService.playClick(); setCurrentScreen('LEADERBOARD'); }} onViewReport={() => { audioService.playClick(); setCurrentScreen('REPORT'); }} onReset={() => { audioService.playClick(); window.location.reload(); }} />}
    </div>
  );
};

export default App;
