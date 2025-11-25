import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuizState } from '../types';
import { CheckCircle2, XCircle, ArrowRight, Timer } from 'lucide-react';

interface QuizGameProps {
  questions: QuizQuestion[];
  onFinish: (state: QuizState) => void;
}

const QuizGame: React.FC<QuizGameProps> = ({ questions, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<QuizState['history']>([]);
  const [timeLeft, setTimeLeft] = useState(20);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (isAnswered) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, isAnswered]);

  const handleTimeUp = () => {
    if (!isAnswered) {
      handleAnswer(-1); // -1 indicates timeout
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    setSelectedOption(optionIndex);
    
    const isCorrect = optionIndex === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setScore(s => s + 10 + Math.ceil(timeLeft / 2)); // Bonus for speed
    }

    setHistory(prev => [
      ...prev,
      {
        question: currentQuestion,
        userAnswerIndex: optionIndex,
        timeTaken: 20 - timeLeft
      }
    ]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(20);
    } else {
      onFinish({
        currentQuestionIndex,
        score,
        answers: history.map(h => h.userAnswerIndex), // This is approximate, really history is better source of truth
        isFinished: true,
        history
      });
    }
  };

  const getButtonColor = (index: number) => {
    if (!isAnswered) {
      return selectedOption === index 
        ? 'bg-cricket-green text-white border-cricket-green' 
        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30';
    }

    if (index === currentQuestion.correctAnswerIndex) {
      return 'bg-green-600 border-green-500 text-white';
    }

    if (selectedOption === index && index !== currentQuestion.correctAnswerIndex) {
      return 'bg-red-600 border-red-500 text-white';
    }

    return 'bg-white/5 border-white/10 opacity-50';
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Header Stats */}
      <div className="flex justify-between items-center glass-panel p-4 rounded-xl">
        <div className="flex items-center gap-2">
           <span className="text-gray-400">Over:</span>
           <span className="font-display font-bold text-xl">{currentQuestionIndex + 1}/{questions.length}</span>
        </div>
        <div className="flex items-center gap-2 text-yellow-500">
           <Timer size={20} />
           <span className={`font-mono text-xl font-bold ${timeLeft < 5 ? 'text-red-500 animate-pulse' : ''}`}>
             00:{timeLeft.toString().padStart(2, '0')}
           </span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-gray-400">Runs:</span>
           <span className="font-display font-bold text-xl text-cricket-green">{score}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-panel p-6 md:p-8 rounded-2xl border-t-4 border-t-cricket-green shadow-2xl relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 p-32 bg-cricket-green/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <h2 className="text-2xl md:text-3xl font-bold font-display leading-tight mb-8 relative z-10">
          {currentQuestion.question}
        </h2>

        <div className="grid grid-cols-1 gap-4 relative z-10">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleAnswer(idx)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 flex justify-between items-center group ${getButtonColor(idx)}`}
            >
              <span className="font-medium text-lg">{option}</span>
              {isAnswered && idx === currentQuestion.correctAnswerIndex && (
                <CheckCircle2 className="text-white" />
              )}
              {isAnswered && selectedOption === idx && idx !== currentQuestion.correctAnswerIndex && (
                <XCircle className="text-white" />
              )}
            </button>
          ))}
        </div>

        {/* Explanation Reveal */}
        {isAnswered && (
          <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10 animate-fade-in">
            <h3 className="text-cricket-green font-bold mb-1 flex items-center gap-2">
              <span className="text-xl">💡</span> Umpire's Call
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Next Button */}
      {isAnswered && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-4 bg-cricket-green hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-cricket-green/20"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Innings' : 'Next Ball'}
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizGame;