import React, { useState } from 'react';
import { Idea } from '../types';
import { IdeaCard } from './IdeaCard';
import { Filter, ChevronDown, Trash2, Download, Bookmark } from 'lucide-react';

interface SavedIdeasProps {
  savedIdeas: Idea[];
  onRemoveIdea: (ideaId: string) => void;
  onApplyToCourse: (idea: Idea) => void;
}

export const SavedIdeas: React.FC<SavedIdeasProps> = ({ savedIdeas, onRemoveIdea, onApplyToCourse }) => {
  const [difficultyFilter, setDifficultyFilter] = useState('All Difficulties');
  const [trendFilter, setTrendFilter] = useState('All Trends');

  const filteredIdeas = savedIdeas.filter(idea => {
    if (difficultyFilter !== 'All Difficulties' && idea.difficulty !== difficultyFilter) return false;
    if (trendFilter !== 'All Trends' && idea.trend !== trendFilter) return false;
    return true;
  });

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Print-only Header */}
      <div className="hidden print:block mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-serif font-bold text-black mb-2">Trendeh</h1>
        <h2 className="text-xl text-gray-600">Saved PDF Opportunities Report</h2>
        <p className="text-sm text-gray-500 mt-2">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-4xl font-bold mb-3 text-gray-900 tracking-tight">Saved Ideas</h2>
          <p className="text-gray-500 text-lg">Manage and review your shortlisted PDF guide concepts.</p>
        </div>
        <button 
          onClick={handleExportPDF}
          disabled={savedIdeas.length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          Export PDF Report
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2rem] p-6 mb-8 shadow-sm print:hidden">
        <div className="flex items-center gap-2 mb-5 text-gray-900 font-bold">
          <Filter className="w-5 h-5 text-pink-500" />
          Filters & Sorting
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Difficulty</label>
            <div className="relative">
              <select 
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 appearance-none focus:outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-500/10 transition-all cursor-pointer"
              >
                <option>All Difficulties</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-3.5 pointer-events-none" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Trend</label>
            <div className="relative">
              <select 
                value={trendFilter}
                onChange={(e) => setTrendFilter(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 appearance-none focus:outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-500/10 transition-all cursor-pointer"
              >
                <option>All Trends</option>
                <option>Rising</option>
                <option>Stable</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Sort By</label>
            <div className="relative">
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 appearance-none focus:outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-500/10 transition-all cursor-pointer">
                <option>Newest First</option>
                <option>Highest Score</option>
                <option>Highest Volume</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-end">
            <button 
              onClick={() => { setDifficultyFilter('All Difficulties'); setTrendFilter('All Trends'); }}
              className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between print:hidden">
        <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Showing {filteredIdeas.length} of {savedIdeas.length} ideas
        </span>
      </div>

      {filteredIdeas.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 border-2 border-gray-200 rounded-[2rem] border-dashed print:hidden">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Bookmark className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No saved ideas yet</h3>
          <p className="text-gray-500">Go to the Generate tab to find and save some ideas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-1 print:gap-8">
          {filteredIdeas.map((idea) => (
            <div key={idea.id} className="relative group print:block">
              <IdeaCard 
                idea={idea} 
                onSave={() => {}} 
                isSaved={true}
                onApply={onApplyToCourse}
              />
              <button
                onClick={() => onRemoveIdea(idea.id)}
                className="absolute top-6 right-6 bg-white hover:bg-red-50 text-red-500 border border-red-100 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:shadow print:hidden"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
