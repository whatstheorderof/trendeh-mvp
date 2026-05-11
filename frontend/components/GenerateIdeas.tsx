import React, { useState } from 'react';
import { Sparkles, Loader2, ChevronDown, AlertCircle } from 'lucide-react';
import { NICHES } from '../constants';
import { Idea } from '../types';
import { IdeaCard } from './IdeaCard';
import { generateIdeas } from '../services/geminiService';

interface GenerateIdeasProps {
  onSaveIdea: (idea: Idea) => void;
  savedIdeas: Idea[];
}

export const GenerateIdeas: React.FC<GenerateIdeasProps> = ({ onSaveIdea, savedIdeas }) => {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('');
  const [numIdeas, setNumIdeas] = useState(5); // Default to 5 for faster API response
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<Idea[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isNicheDropdownOpen, setIsNicheDropdownOpen] = useState(false);

  const handleGenerate = async () => {
    if (!niche) {
      alert('Please select a niche first.');
      return;
    }
    
    setIsGenerating(true);
    setResults(null);
    setError(null);

    try {
      const generated = await generateIdeas(topic, niche, numIdeas);
      setResults(generated);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while fetching market data.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 tracking-tight">
          Find <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Profitable</span><br/>
          PDF Ideas.
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl">Discover trending digital product concepts based on real search data and market gaps.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2rem] p-8 mb-12 shadow-soft relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full blur-3xl opacity-30 -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="space-y-8 relative z-10">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Topic or Problem <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., healthy meal planning for busy parents..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-500/10 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Niche <span className="text-pink-500">*</span>
              </label>
              <div 
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 cursor-pointer flex justify-between items-center hover:border-gray-300 transition-colors focus-within:ring-4 focus-within:ring-pink-500/10"
                onClick={() => setIsNicheDropdownOpen(!isNicheDropdownOpen)}
              >
                <span className={niche ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                  {niche || 'Select a niche'}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
              
              {isNicheDropdownOpen && (
                <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto py-2">
                  {NICHES.map((n) => (
                    <div
                      key={n}
                      className="px-5 py-3 hover:bg-pink-50 hover:text-pink-600 cursor-pointer transition-colors text-sm font-medium text-gray-700"
                      onClick={() => {
                        setNiche(n);
                        setIsNicheDropdownOpen(false);
                      }}
                    >
                      {n}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Number of Ideas
                </label>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                  {numIdeas}
                </span>
              </div>
              <div className="relative pt-2 px-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={numIdeas}
                  onChange={(e) => setNumIdeas(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-3 font-medium">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !niche}
              className={`w-full md:w-auto md:px-12 py-4 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 mx-auto ${
                isGenerating 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : !niche
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-glow hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Live Market Data...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Ideas
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-16 animate-pulse">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Scanning Live Trends...</h3>
          <p className="text-gray-500">Cross-referencing Google Search volume with competition data.</p>
        </div>
      )}

      {results && !isGenerating && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900">
              Top Opportunities Found
            </h3>
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {results.length} Results
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {results.map((idea) => (
              <IdeaCard 
                key={idea.id} 
                idea={idea} 
                onSave={onSaveIdea}
                isSaved={savedIdeas.some(s => s.id === idea.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
