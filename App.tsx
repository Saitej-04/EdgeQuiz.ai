import React, { useState } from 'react';
import { AppScreen, Difficulty, QuizQuestion, QuizState } from './types';
import StartScreen from './components/StartScreen';
import QuizGame from './components/QuizGame';
import ResultScreen from './components/ResultScreen';
import { generateQuizQuestions } from './services/geminiService';
import { Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.START);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const startGame = async (difficulty: Difficulty) => {
    setScreen(AppScreen.LOADING);
    setErrorMsg("");
    try {
      // Fetch 5 questions for a quick game
      const fetchedQuestions = await generateQuizQuestions(difficulty, 5);
      setQuestions(fetchedQuestions);
      setScreen(AppScreen.QUIZ);
    } catch (error) {
      console.error(error);
      setErrorMsg("Rain stopped play. Could not fetch questions from the umpire (AI). Please check your connection or API key.");
      setScreen(AppScreen.ERROR);
    }
  };

  const finishGame = (finalState: QuizState) => {
    setQuizState(finalState);
    setScreen(AppScreen.RESULT);
  };

  const restartGame = () => {
    setScreen(AppScreen.START);
    setQuestions([]);
    setQuizState(null);
  };

  return (
    <div className="min-h-screen bg-cricket-dark bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a2e26] to-cricket-dark text-white font-sans selection:bg-cricket-green selection:text-white overflow-x-hidden">
      
      {/* Background Mesh/Grid */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12 min-h-screen flex flex-col">
        
        {/* Navigation/Logo Area */}
        {screen !== AppScreen.START && (
          <header className="flex justify-between items-center mb-8">
            <div 
              className="text-2xl font-display font-bold text-cricket-green cursor-pointer hover:opacity-80 transition-opacity"
              onClick={restartGame}
            >
              EDGE QUIZ
            </div>
          </header>
        )}

        {/* Content Area */}
        <div className="flex-1 flex flex-col justify-center">
          
          {screen === AppScreen.START && (
            <StartScreen onStart={startGame} />
          )}

          {screen === AppScreen.LOADING && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                 <div className="w-16 h-16 border-4 border-cricket-green/30 border-t-cricket-green rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-8 h-8 bg-red-600 rounded-full shadow-inner"></div> {/* Cricket Ball */}
                 </div>
              </div>
              <p className="text-xl font-display animate-pulse">Consulting the Third Umpire...</p>
              <p className="text-sm text-gray-400">Generating fresh questions via Gemini AI</p>
            </div>
          )}

          {screen === AppScreen.QUIZ && (
            <QuizGame questions={questions} onFinish={finishGame} />
          )}

          {screen === AppScreen.RESULT && quizState && (
            <ResultScreen quizState={quizState} onRestart={restartGame} />
          )}

          {screen === AppScreen.ERROR && (
             <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto p-8 glass-panel rounded-2xl border-red-500/30 border">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Match Abandoned</h2>
                <p className="text-gray-300 mb-6">{errorMsg}</p>
                <button 
                  onClick={restartGame}
                  className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Return to Pavilion
                </button>
             </div>
          )}

        </div>

        <footer className="mt-8 text-center text-xs text-gray-500">
           <p>Powered by Google Gemini • Built with React & Tailwind</p>
        </footer>
      </main>
    </div>
  );
};

export default App;