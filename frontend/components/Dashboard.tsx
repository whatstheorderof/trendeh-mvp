import React from 'react';
import { Idea, ViewState } from '../types';
import { Lightbulb, TrendingUp, Target, ArrowRight, Bookmark, Activity, GraduationCap } from 'lucide-react';

interface DashboardProps {
  savedIdeas: Idea[];
  onNavigate: (view: ViewState) => void;
  onApplyToCourse: (idea: Idea) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ savedIdeas, onNavigate, onApplyToCourse }) => {
  const totalSaved = savedIdeas.length;
  const avgScore = totalSaved > 0 
    ? Math.round(savedIdeas.reduce((acc, idea) => acc + idea.opportunityScore, 0) / totalSaved) 
    : 0;
  
  const totalVolume = savedIdeas.reduce((acc, idea) => acc + idea.searchVolume, 0);
  
  const recentIdeas = [...savedIdeas].sort((a, b) => 
    new Date(b.dateGenerated).getTime() - new Date(a.dateGenerated).getTime()
  ).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="mb-10">
        <h2 className="text-4xl font-bold mb-3 text-gray-900 tracking-tight">Welcome back.</h2>
        <p className="text-gray-500 text-lg">Here's an overview of your PDF product research.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-pink-50 text-pink-600 rounded-xl">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-600">Saved Ideas</h3>
            </div>
            <div className="text-4xl font-black text-gray-900">{totalSaved}</div>
            <p className="text-sm text-gray-500 mt-2">Ready to be developed</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-600">Avg. Opp Score</h3>
            </div>
            <div className="text-4xl font-black text-gray-900">{avgScore}<span className="text-xl text-gray-400 font-bold">/100</span></div>
            <p className="text-sm text-gray-500 mt-2">Across your saved portfolio</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-600">Total Search Vol.</h3>
            </div>
            <div className="text-4xl font-black text-gray-900">
              {totalVolume > 1000000 ? `${(totalVolume / 1000000).toFixed(1)}M` : totalVolume > 1000 ? `${(totalVolume / 1000).toFixed(1)}k` : totalVolume}
            </div>
            <p className="text-sm text-gray-500 mt-2">Monthly searches captured</p>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recently Saved</h3>
            {totalSaved > 0 && (
              <button 
                onClick={() => onNavigate('saved')}
                className="text-sm font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {totalSaved === 0 ? (
            <div className="bg-gray-50 border-2 border-gray-200 border-dashed rounded-[2rem] p-10 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Lightbulb className="w-8 h-8 text-gray-300" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">No ideas saved yet</h4>
              <p className="text-gray-500 mb-6">Start generating ideas to build your product pipeline.</p>
              <button 
                onClick={() => onNavigate('generate')}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold shadow-glow hover:shadow-lg transition-all"
              >
                Generate Ideas
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentIdeas.map(idea => (
                <div key={idea.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex-1 pr-4 cursor-pointer" onClick={() => onApplyToCourse(idea)}>
                    <h4 className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-1">{idea.title}</h4>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {idea.trend}</span>
                      <span>•</span>
                      <span>Score: {idea.opportunityScore}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onApplyToCourse(idea)}
                      className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-900 hover:text-white transition-colors"
                      title="Apply to PDF Pipeline"
                    >
                      <GraduationCap className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onNavigate('saved')}
                      className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-pink-50 transition-colors"
                    >
                      <ArrowRight className="w-5 h-5 text-gray-400 hover:text-pink-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Next Steps</h3>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <GraduationCap className="w-10 h-10 text-pink-400 mb-6" />
            <h4 className="text-2xl font-bold mb-3">The PDF Pipeline</h4>
            <p className="text-gray-300 mb-8 leading-relaxed">Learn the exact 7-stage system to turn your generated PDF ideas into a ready-to-launch PDF product.</p>
            <button 
              onClick={() => onNavigate('course')}
              className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              Start Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
