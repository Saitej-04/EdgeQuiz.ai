import React from 'react';
import { QuizState } from '../types';
import { RefreshCcw, Share2, Medal } from 'lucide-react';

interface ResultScreenProps {
  quizState: QuizState;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ quizState, onRestart }) => {
  const totalQuestions = quizState.history.length;
  const correctAnswers = quizState.history.filter(h => h.userAnswerIndex === h.question.correctAnswerIndex).length;
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

  const getRank = () => {
    if (accuracy === 100) return { title: "The Don", color: "text-yellow-400" };
    if (accuracy >= 80) return { title: "Top Order Batter", color: "text-cricket-green" };
    if (accuracy >= 60) return { title: "Solid All-Rounder", color: "text-blue-400" };
    if (accuracy >= 40) return { title: "Tailender", color: "text-orange-400" };
    return { title: "Water Boy", color: "text-red-400" };
  };

  const rank = getRank();

  return (
    <div className="w-full max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
      
      <div className="relative">
         <div className="absolute inset-0 bg-cricket-green blur-[100px] opacity-20 pointer-events-none"></div>
         <h1 className="text-5xl font-display font-bold mb-2">Innings Closed</h1>
         <p className="text-gray-400">Here is your match summary</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-cricket-green to-transparent opacity-50"></div>
         
         <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-4 border-2 border-white/10">
                <Medal size={40} className={rank.color} />
            </div>
            <h2 className={`text-3xl font-bold ${rank.color}`}>{rank.title}</h2>
         </div>

         <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-black/30">
                <div className="text-gray-400 text-sm uppercase tracking-wider mb-1">Runs</div>
                <div className="text-3xl font-display font-bold text-white">{quizState.score}</div>
            </div>
            <div className="p-4 rounded-xl bg-black/30">
                <div className="text-gray-400 text-sm uppercase tracking-wider mb-1">Wickets</div>
                <div className="text-3xl font-display font-bold text-white">{totalQuestions - correctAnswers}</div>
            </div>
            <div className="p-4 rounded-xl bg-black/30">
                <div className="text-gray-400 text-sm uppercase tracking-wider mb-1">Strike Rate</div>
                <div className="text-3xl font-display font-bold text-white">{accuracy}%</div>
            </div>
         </div>

         {/* Detailed breakdown per ball */}
         <div className="space-y-3 text-left">
            <h3 className="text-sm uppercase text-gray-500 font-bold tracking-wider mb-4">Ball by Ball</h3>
            {quizState.history.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        item.userAnswerIndex === item.question.correctAnswerIndex ? 'bg-cricket-green text-white' : 'bg-red-500/20 text-red-500'
                    }`}>
                        {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.question.question}</p>
                        <p className="text-xs text-gray-400 truncate">{item.question.options[item.question.correctAnswerIndex]}</p>
                    </div>
                    <div className="text-xs font-mono text-gray-500">
                        {item.timeTaken}s
                    </div>
                </div>
            ))}
         </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button 
          onClick={onRestart}
          className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
        >
          <RefreshCcw size={18} />
          Play Again
        </button>
        {/* Placeholder for share functionality */}
        <button 
          className="flex items-center gap-2 px-8 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors"
        >
          <Share2 size={18} />
          Share Stats
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;