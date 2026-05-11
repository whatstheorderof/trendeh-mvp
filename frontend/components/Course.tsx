import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, BookOpen, Target, Users, Search, DollarSign, Rocket, FileText, MessageSquare, Loader2, PenTool, Palette } from 'lucide-react';
import { Idea, DetailedRoadmap } from '../types';
import { generateIdeaRoadmap } from '../services/geminiService';

interface CourseProps {
  selectedIdea: Idea | null;
  onSelectIdea: () => void;
}

const STAGES = [
  { id: '01', title: 'Niche Research', status: 'completed' },
  { id: '02', title: 'Opportunity', status: 'current' },
  { id: '03', title: 'Outreach', status: 'upcoming' },
  { id: '04', title: 'Discovery Call', status: 'upcoming' },
  { id: '05', title: 'Blueprint', status: 'upcoming' },
  { id: '06', title: 'Pricing', status: 'upcoming' },
  { id: '07', title: 'Launch Strategy', status: 'upcoming' },
];

export const Course: React.FC<CourseProps> = ({ selectedIdea, onSelectIdea }) => {
  const [roadmap, setRoadmap] = useState<DetailedRoadmap | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (selectedIdea) {
      setIsGenerating(true);
      generateIdeaRoadmap(selectedIdea)
        .then(setRoadmap)
        .catch(console.error)
        .finally(() => setIsGenerating(false));
    } else {
      setRoadmap(null);
    }
  }, [selectedIdea]);

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="mb-12 print:hidden">
        <div className="flex items-center gap-2 text-pink-500 font-bold text-sm tracking-wider uppercase mb-4">
          <BookOpen className="w-4 h-4" />
          The System
        </div>
        <h2 className="text-5xl font-bold mb-4 text-gray-900 tracking-tight">
          The PDF Pipeline.
        </h2>
        <p className="text-gray-500 text-xl max-w-2xl">
          Seven stages. Each one's output feeds the next. End result: a ready-to-launch PDF product.
        </p>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-serif font-bold text-black mb-2">Trendeh</h1>
        <h2 className="text-xl text-gray-600">Custom PDF Pipeline Roadmap</h2>
        <p className="text-sm text-gray-500 mt-2">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      {/* Flowchart / Stepper */}
      <div className="bg-white border border-gray-100 rounded-[2rem] p-10 shadow-sm mb-12 print:hidden">
        <h3 className="text-xl font-bold text-gray-900 mb-8">Course Progress</h3>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 relative">
          {STAGES.map((stage, index) => {
            const isCompleted = stage.status === 'completed';
            const isCurrent = stage.status === 'current';
            
            return (
              <React.Fragment key={stage.id}>
                <div className={`
                  relative flex flex-col items-center justify-center w-40 h-24 rounded-2xl border-2 transition-all
                  ${isCompleted ? 'bg-blue-50 border-blue-100 text-blue-700' : ''}
                  ${isCurrent ? 'bg-white border-pink-500 text-pink-600 shadow-glow scale-105 z-10' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-orange-50/50 border-orange-100 text-orange-800/60' : ''}
                `}>
                  <span className="text-xs font-bold opacity-50 mb-1">{stage.id}</span>
                  <span className="font-bold text-center px-2 leading-tight">{stage.title}</span>
                  
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 bg-white rounded-full">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-100" />
                    </div>
                  )}
                </div>

                {/* Arrow connector (hide on last item) */}
                {index < STAGES.length - 1 && (
                  <div className="hidden md:flex items-center justify-center text-gray-300">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Dynamic Roadmap Section */}
      <div className="border-t border-gray-200 pt-12 print:border-none print:pt-0">
        {selectedIdea ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2 print:text-black">Your Custom Roadmap</h3>
              <p className="text-gray-500 text-lg print:text-gray-800">Applying the PDF Pipeline framework to: <strong className="text-gray-900 print:text-black">{selectedIdea.title}</strong></p>
            </div>

            {isGenerating ? (
              <div className="py-20 flex flex-col items-center justify-center bg-white border border-gray-100 rounded-[2rem] shadow-sm print:hidden">
                <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Developing PDF Pipeline...</h3>
                <p className="text-gray-500">Our AI is building a custom 7-stage execution plan for your idea.</p>
              </div>
            ) : roadmap ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:block print:space-y-8">
                {/* Stage 1 */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm print:border-gray-300 print:shadow-none print:break-inside-avoid print:mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl print:bg-transparent print:p-0"><Users className="w-5 h-5 print:text-black" /></div>
                    <h4 className="font-bold text-lg text-gray-900 print:text-black">01. Niche Research</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 print:text-gray-600">Target Avatar</div>
                      <p className="text-sm text-gray-800 font-medium print:text-black">{roadmap.niche.avatar}</p>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 print:text-gray-600">Deep Pain Points</div>
                      <ul className="list-disc list-inside text-sm text-gray-700 ml-2 space-y-1 print:text-black">
                        {roadmap.niche.deepPain.map((pain, i) => <li key={i}>{pain}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm print:border-gray-300 print:shadow-none print:break-inside-avoid print:mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl print:bg-transparent print:p-0"><Target className="w-5 h-5 print:text-black" /></div>
                    <h4 className="font-bold text-lg text-gray-900 print:text-black">02. Opportunity</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 print:bg-transparent print:border-gray-200">
                      <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1 print:text-gray-600">The Market Gap</div>
                      <p className="text-sm text-emerald-900 font-medium print:text-black">{roadmap.opportunity.gap}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 print:bg-transparent print:border-gray-200">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 print:text-gray-600">Your Unique Angle</div>
                      <p className="text-sm text-gray-800 font-medium print:text-black">{roadmap.opportunity.angle}</p>
                    </div>
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm print:border-gray-300 print:shadow-none print:break-inside-avoid print:mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl print:bg-transparent print:p-0"><Search className="w-5 h-5 print:text-black" /></div>
                    <h4 className="font-bold text-lg text-gray-900 print:text-black">03. Outreach</h4>
                  </div>
                  <div className="mb-4">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 print:text-gray-600">Best Platforms</div>
                    <div className="flex gap-2 flex-wrap">
                      {roadmap.outreach.platforms.map((p, i) => <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold print:bg-transparent print:border print:border-gray-300 print:text-black">{p}</span>)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 print:text-gray-600">Viral Hooks</div>
                    <ul className="space-y-2">
                      {roadmap.outreach.hooks.map((hook, i) => (
                        <li key={i} className="text-sm font-medium text-gray-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 print:bg-transparent print:border-gray-200 print:text-black">"{hook}"</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Stage 4 */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm print:border-gray-300 print:shadow-none print:break-inside-avoid print:mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl print:bg-transparent print:p-0"><MessageSquare className="w-5 h-5 print:text-black" /></div>
                    <h4 className="font-bold text-lg text-gray-900 print:text-black">04. Discovery</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 print:text-gray-600">Community Poll Question</div>
                      <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 text-amber-900 text-sm italic print:bg-transparent print:border-gray-200 print:text-black">
                        "{roadmap.discovery.pollQuestion}"
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 print:text-gray-600">Validation DM Script</div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-800 text-sm print:bg-transparent print:border-gray-200 print:text-black">
                        {roadmap.discovery.dmScript}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stage 5 */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm md:col-span-2 print:border-gray-300 print:shadow-none print:break-inside-avoid print:mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-pink-50 text-pink-600 rounded-xl print:bg-transparent print:p-0"><FileText className="w-5 h-5 print:text-black" /></div>
                    <h4 className="font-bold text-lg text-gray-900 print:text-black">05. Blueprint (Product Outline)</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 print:grid-cols-2">
                    {roadmap.blueprint.chapters.map((chapter, i) => (
                      <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100 print:bg-transparent print:border-gray-200">
                        <div className="text-pink-500 font-black text-xl mb-1 print:text-black">{(i+1).toString().padStart(2, '0')}</div>
                        <div className="text-sm font-bold text-gray-800 print:text-black">{chapter}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bonus: PDF Generation Guide */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm md:col-span-2 print:border-gray-300 print:shadow-none print:break-inside-avoid print:mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl print:bg-transparent print:p-0"><PenTool className="w-5 h-5 print:text-black" /></div>
                    <h4 className="font-bold text-lg text-gray-900 print:text-black">Bonus: PDF Generation Guide</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 print:text-gray-600">Content Structure</div>
                      <ul className="list-decimal list-inside text-sm text-gray-700 space-y-1 print:text-black">
                        {roadmap.pdfGenerationGuide.structure.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-4 mb-2 print:text-gray-600">Recommended Tools</div>
                      <div className="flex gap-2 flex-wrap">
                        {roadmap.pdfGenerationGuide.toolRecommendations.map((t, i) => <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold print:bg-transparent print:border print:border-gray-300 print:text-black">{t}</span>)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 print:text-gray-600">AI Master Prompt</div>
                      <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 text-gray-300 text-sm font-mono h-full whitespace-pre-wrap print:bg-transparent print:border-gray-200 print:text-black">
                        {roadmap.pdfGenerationGuide.writingPrompt}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bonus: Cover Design Guide */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm md:col-span-2 print:border-gray-300 print:shadow-none print:break-inside-avoid print:mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl print:bg-transparent print:p-0"><Palette className="w-5 h-5 print:text-black" /></div>
                    <h4 className="font-bold text-lg text-gray-900 print:text-black">Bonus: Cover Design Guide</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-2">
                    <div className="md:col-span-2 print:col-span-1">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 print:text-gray-600">Visual Concept</div>
                      <p className="text-sm text-gray-800 mb-4 print:text-black">{roadmap.pdfCoverGuide.visualConcept}</p>
                      
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 print:text-gray-600">Canva Search Keywords</div>
                      <div className="flex gap-2 flex-wrap">
                        {roadmap.pdfCoverGuide.canvaKeywords.map((k, i) => <span key={i} className="px-3 py-1 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold print:bg-transparent print:border print:border-gray-300 print:text-black">{k}</span>)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 print:text-gray-600">Typography</div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-800 text-sm font-medium mb-4 print:bg-transparent print:border-gray-200 print:text-black">
                        {roadmap.pdfCoverGuide.fontPairing}
                      </div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 print:text-gray-600">Color Palette</div>
                      <div className="flex gap-2 flex-wrap">
                        {roadmap.pdfCoverGuide.colorPalette.map((c, i) => (
                          <div key={i} className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 print:bg-transparent print:border-gray-200">
                            <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: c.startsWith('#') ? c : undefined }}></div>
                            <span className="text-xs font-medium text-gray-700 print:text-black">{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stage 6 & 7 */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-8 shadow-xl md:col-span-2 text-white relative overflow-hidden print:bg-none print:bg-white print:border-gray-300 print:shadow-none print:text-black print:break-inside-avoid print:mb-6">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 print:hidden"></div>
                  <div className="relative z-10 flex flex-col md:flex-row gap-8 print:flex-row">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-white/10 text-white rounded-xl print:bg-transparent print:p-0"><DollarSign className="w-5 h-5 print:text-black" /></div>
                        <h4 className="font-bold text-lg print:text-black">06. Pricing Strategy</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 print:bg-transparent print:border-gray-200">
                          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1 print:text-gray-600">Basic Tier</div>
                          <div className="font-bold text-white print:text-black">{roadmap.pricing.basic}</div>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl border border-white/20 relative overflow-hidden print:bg-transparent print:border-gray-200">
                          <div className="absolute top-0 right-0 bg-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg print:hidden">POPULAR</div>
                          <div className="text-xs text-pink-200 uppercase tracking-wider mb-1 print:text-gray-600">Pro Tier</div>
                          <div className="font-bold text-white print:text-black">{roadmap.pricing.pro}</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 print:bg-transparent print:border-gray-200">
                          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1 print:text-gray-600">Premium Tier</div>
                          <div className="font-bold text-white print:text-black">{roadmap.pricing.premium}</div>
                        </div>
                      </div>
                    </div>
                    <div className="w-px bg-white/10 hidden md:block print:bg-gray-200"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-white/10 text-white rounded-xl print:bg-transparent print:p-0"><Rocket className="w-5 h-5 print:text-black" /></div>
                        <h4 className="font-bold text-lg print:text-black">07. Launch Strategy</h4>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 print:text-gray-600">Launch Plan</div>
                          <p className="text-sm text-gray-300 leading-relaxed print:text-black">{roadmap.launch.launchPlan}</p>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 print:text-gray-600">Promo Email Subject</div>
                          <div className="bg-black/30 p-3 rounded-xl border border-white/10 text-pink-300 font-medium text-sm print:bg-transparent print:border-gray-200 print:text-black">
                            "{roadmap.launch.emailSubject}"
                          </div>
                        </div>
                        <button 
                          onClick={() => window.print()}
                          className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm mt-4 print:hidden"
                        >
                          Export Full Plan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center print:hidden">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Target className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Apply the Framework</h3>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
              Select a saved PDF idea from your dashboard to generate a custom 7-stage roadmap for your product.
            </p>
            <button 
              onClick={onSelectIdea}
              className="px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-full font-bold shadow-sm transition-all"
            >
              Choose a Saved Idea
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
