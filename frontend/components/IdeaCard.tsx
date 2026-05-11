import React, { useState } from 'react';
import { Idea } from '../types';
import { Bookmark, Users, Search, Trophy, TrendingUp, ChevronDown, Check, Coins, GraduationCap } from 'lucide-react';

interface IdeaCardProps {
  idea: Idea;
  onSave: (idea: Idea) => void;
  isSaved: boolean;
  onApply?: (idea: Idea) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onSave, isSaved, onApply }) => {
  const [showQueries, setShowQueries] = useState(false);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Hard': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white border border-gray-100 rounded-[1.5rem] p-6 flex flex-col shadow-sm hover:shadow-md transition-all duration-300 group print:break-inside-avoid print:shadow-none print:border-gray-300 print:mb-6">
      <div className="flex justify-between items-start gap-4 mb-4">
        <h3 className="text-xl font-bold leading-tight text-gray-900 group-hover:text-pink-600 transition-colors print:text-black">{idea.title}</h3>
        <button 
          onClick={() => onSave(idea)}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all print:hidden ${
            isSaved 
              ? 'bg-pink-50 text-pink-600 border border-pink-200' 
              : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300'
          }`}
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          {isSaved ? 'Saved' : 'Save'}
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-6 flex-1 leading-relaxed print:text-gray-800">{idea.description}</p>

      <div className="flex items-start gap-2 mb-6 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl print:bg-transparent print:p-0 print:mb-4">
        <Users className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400 print:text-gray-600" />
        <p className="font-medium print:text-gray-800">{idea.audience}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 print:mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(idea.difficulty)} print:border-gray-300 print:bg-transparent print:text-gray-800`}>
          {idea.difficulty}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 print:border-gray-300 print:bg-transparent print:text-gray-800">
          {idea.interest}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 print:border-gray-300 print:bg-transparent print:text-gray-800">
          {idea.competition}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 print:border-gray-300 print:bg-transparent print:text-gray-800">
          <TrendingUp className="w-3 h-3" />
          {idea.trend}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 font-medium print:mb-4">
        <Search className="w-4 h-4 text-gray-400 print:text-gray-600" />
        <span>~{idea.searchVolume.toLocaleString()} searches/mo</span>
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-2xl p-5 mb-4 flex items-center justify-between print:bg-none print:border-gray-200">
        <div className="flex items-center gap-2 text-gray-700">
          <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 print:border-none print:shadow-none print:p-0">
            <Trophy className="w-5 h-5 text-amber-500 print:text-gray-800" />
          </div>
          <span className="font-bold">Opportunity Score</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-black tracking-tighter ${getScoreColor(idea.opportunityScore)} print:text-black`}>
            {idea.opportunityScore}
          </span>
          <span className="text-sm font-bold text-gray-400">/100</span>
        </div>
      </div>

      {/* Monetization Angles */}
      <div className="mt-2 mb-4 pt-4 border-t border-gray-100 print:border-gray-200">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3 print:text-black">
          <Coins className="w-4 h-4 text-emerald-500 print:text-gray-800" />
          Monetization Angles
        </div>
        <div className="flex flex-wrap gap-2">
          {idea.monetizationAngles?.map((angle, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-100 print:bg-transparent print:border-gray-300 print:text-gray-800">
              {angle}
            </span>
          ))}
        </div>
      </div>

      <div className="print:block">
        <button 
          onClick={() => setShowQueries(!showQueries)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors w-full justify-center py-2 print:hidden"
        >
          <Search className="w-4 h-4" />
          Show Example Queries ({idea.exampleQueries.length})
          <ChevronDown className={`w-4 h-4 transition-transform ${showQueries ? 'rotate-180' : ''}`} />
        </button>
        
        {/* Always show queries when printing */}
        <div className={`${showQueries ? 'block' : 'hidden'} print:block mt-3 space-y-2 animate-in fade-in slide-in-from-top-2`}>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 hidden print:block">Example Queries</div>
          {idea.exampleQueries.map((query, idx) => (
            <div key={idx} className="bg-gray-50 px-4 py-2.5 rounded-xl text-sm text-gray-600 border border-gray-100 font-medium print:bg-transparent print:border-gray-200 print:text-gray-800">
              "{query}"
            </div>
          ))}
        </div>
      </div>

      {/* Apply to Course Button */}
      {onApply && (
        <div className="mt-4 pt-4 border-t border-gray-100 print:hidden">
          <button
            onClick={() => onApply(idea)}
            className="w-full py-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
          >
            <GraduationCap className="w-5 h-5" />
            Apply to 10K Stack
          </button>
        </div>
      )}
    </div>
  );
};
