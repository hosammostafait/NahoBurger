
export type Screen = 'WELCOME' | 'ABOUT' | 'LOGIN' | 'STORY' | 'MAP' | 'LESSON_INTRO' | 'QUIZ' | 'RESULT' | 'FINAL' | 'LEADERBOARD' | 'MEMORY_GAME' | 'GUESS_NUMBER' | 'WORD_SEARCH' | 'REPORT';

export type Gender = 'boy' | 'girl';
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface QuizAttempt {
  stationId: number;
  questionId: number;
  questionText: string;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  topic: string;
}

export interface User {
  username: string;
  gender: Gender;
  difficulty: Difficulty;
  progress: Progress;
  history: QuizAttempt[];
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Station {
  id: number;
  title: string;
  description: string;
  summaryPoints: string[];
  questions: Question[];
}

export interface Progress {
  completedStations: number[];
  totalScore: number;
}
