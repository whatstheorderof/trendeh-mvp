export interface Idea {
  id: string;
  title: string;
  description: string;
  audience: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  interest: 'High Interest' | 'Med Interest' | 'Low Interest';
  competition: 'Low Competition' | 'Med Competition' | 'High Competition';
  trend: 'Rising' | 'Stable' | 'Declining';
  searchVolume: number;
  opportunityScore: number;
  exampleQueries: string[];
  monetizationAngles: string[];
  dateGenerated: string;
}

export interface DetailedRoadmap {
  niche: { avatar: string; deepPain: string[] };
  opportunity: { gap: string; angle: string };
  outreach: { platforms: string[]; hooks: string[] };
  discovery: { pollQuestion: string; dmScript: string };
  blueprint: { chapters: string[] };
  pricing: { basic: string; pro: string; premium: string };
  launch: { launchPlan: string; emailSubject: string };
  pdfGenerationGuide: {
    structure: string[];
    writingPrompt: string;
    toolRecommendations: string[];
  };
  pdfCoverGuide: {
    visualConcept: string;
    colorPalette: string[];
    fontPairing: string;
    canvaKeywords: string[];
  };
}

export type ViewState = 'dashboard' | 'generate' | 'saved' | 'course' | 'upgrade';
