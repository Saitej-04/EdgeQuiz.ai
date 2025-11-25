export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
  GOOGLY = 'Googly (Tricky)'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  answers: number[]; // Index of selected answer for each question
  isFinished: boolean;
  history: {
    question: QuizQuestion;
    userAnswerIndex: number;
    timeTaken: number;
  }[];
}

export enum AppScreen {
  START,
  LOADING,
  QUIZ,
  RESULT,
  ERROR
}
