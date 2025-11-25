import React from 'react';
import { Difficulty } from '../types';
import { Trophy, Activity, Zap, Brain } from 'lucide-react';

interface StartScreenProps {
  onStart: (difficulty: Difficulty) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cricket-green to-teal-400">
          EDGE QUIZ
        </h1>
        <p className="text-gray-400 text-lg">Are you ready to face the bowling?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
        <DifficultyCard 
          icon={<Zap size={24} />}
          title="T20 Blast (Easy)"
          desc="Warm up with some easy full tosses."
          color="bg-green-500/20 hover:bg-green-500/30 border-green-500/50"
          onClick={() => onStart(Difficulty.EASY)}
        />
        <DifficultyCard 
          icon={<Activity size={24} />}
          title="ODI Classic (Medium)"
          desc="Standard pace. Good line and length."
          color="bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/50"
          onClick={() => onStart(Difficulty.MEDIUM)}
        />
        <DifficultyCard 
          icon={<Trophy size={24} />}
          title="Test Match (Hard)"
          desc="For the purists. Deep stats and history."
          color="bg-red-500/20 hover:bg-red-500/30 border-red-500/50"
          onClick={() => onStart(Difficulty.HARD)}
        />
        <DifficultyCard 
          icon={<Brain size={24} />}
          title="The Googly (Tricky)"
          desc="Obscure laws and rare records."
          color="bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/50"
          onClick={() => onStart(Difficulty.GOOGLY)}
        />
      </div>
    </div>
  );
};

const DifficultyCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  onClick: () => void;
}> = ({ icon, title, desc, color, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-xl border transition-all duration-300 transform hover:scale-105 flex flex-col items-center gap-3 text-left group ${color}`}
  >
    <div className="p-3 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
      {icon}
    </div>
    <div className="w-full text-center">
      <h3 className="font-display font-bold text-xl mb-1">{title}</h3>
      <p className="text-sm text-gray-300">{desc}</p>
    </div>
  </button>
);

export default StartScreen;