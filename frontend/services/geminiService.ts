import { GoogleGenAI, Type } from '@google/genai';
import { Idea, DetailedRoadmap } from '../types';
import { MOCK_GENERATED_IDEAS } from '../constants';

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

export const generateIdeas = async (topic: string, niche: string, count: number): Promise<Idea[]> => {
  try {
    // Step 1: Use Google Search to gather raw market data (No JSON schema allowed here)
    const researchPrompt = `
      Research the current market trends, pain points, and search demand for PDF guides in the niche: "${niche}". 
      Specific Topic/Problem: "${topic || 'General trending problems'}".
      Use Google Search to find recent breakout searches, Reddit pain points, and TikTok/YouTube momentum.
      Summarize the top ${count} highly profitable, underserved PDF guide ideas.
    `;

    const researchResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: researchPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const researchData = researchResponse.text;

    // Step 2: Format the research data into strict JSON using responseSchema
    const formatPrompt = `
      Based on the following market research, generate exactly ${count} PDF guide ideas.
      Score them based on Search Volume, Competition, and Purchase Intent.
      
      Research Data:
      ${researchData}
    `;

    const formatResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formatPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING, description: "Catchy, specific title of the PDF guide" },
              description: { type: Type.STRING, description: "1-2 sentence description of what it solves" },
              audience: { type: Type.STRING, description: "Specific target audience" },
              difficulty: { type: Type.STRING, description: "Must be exactly 'Easy', 'Medium', or 'Hard'" },
              interest: { type: Type.STRING, description: "Must be exactly 'High Interest', 'Med Interest', or 'Low Interest'" },
              competition: { type: Type.STRING, description: "Must be exactly 'Low Competition', 'Med Competition', or 'High Competition'" },
              trend: { type: Type.STRING, description: "Must be exactly 'Rising', 'Stable', or 'Declining'" },
              searchVolume: { type: Type.NUMBER, description: "Estimated monthly search volume" },
              opportunityScore: { type: Type.NUMBER, description: "Score from 1 to 100" },
              exampleQueries: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 real-world search queries" },
              monetizationAngles: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-3 specific ways to monetize" },
              dateGenerated: { type: Type.STRING }
            },
            required: ["title", "description", "audience", "difficulty", "interest", "competition", "trend", "searchVolume", "opportunityScore", "exampleQueries", "monetizationAngles"]
          }
        }
      }
    });

    const text = formatResponse.text || '[]';
    const ideas: Idea[] = JSON.parse(text);
    
    return ideas.map((idea, index) => ({
      ...idea,
      id: idea.id || `gen-${Date.now()}-${index}`,
      dateGenerated: idea.dateGenerated || new Date().toISOString()
    }));

  } catch (error) {
    console.error("Error generating ideas from Gemini:", error);
    // Fallback for Vercel/GitHub deployments where API_KEY might be missing or rate-limited
    console.warn("Falling back to mock data due to API error.");
    
    // Return a shuffled subset of mock data to simulate generation
    const shuffled = [...MOCK_GENERATED_IDEAS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length)).map(idea => ({
      ...idea,
      id: `mock-${Date.now()}-${Math.random()}`
    }));
  }
};

export const generateIdeaRoadmap = async (idea: Idea): Promise<DetailedRoadmap> => {
  const prompt = `
    You are an expert digital product strategist and copywriter. 
    I have a validated PDF guide idea:
    
    Title: ${idea.title}
    Description: ${idea.description}
    Audience: ${idea.audience}
    
    Generate a detailed 7-stage execution roadmap to take this from idea to a profitable launch.
    Also, provide a PDF Generation Guide and a PDF Cover Design Guide.
    Be highly specific, actionable, and creative.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            niche: {
              type: Type.OBJECT,
              properties: {
                avatar: { type: Type.STRING, description: "A 1-sentence specific persona description" },
                deepPain: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-3 deep emotional pain points" }
              }
            },
            opportunity: {
              type: Type.OBJECT,
              properties: {
                gap: { type: Type.STRING, description: "What existing solutions are missing" },
                angle: { type: Type.STRING, description: "Our unique, highly-converting spin" }
              }
            },
            outreach: {
              type: Type.OBJECT,
              properties: {
                platforms: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 2-3 platforms to market this" },
                hooks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 viral social media hooks" }
              }
            },
            discovery: {
              type: Type.OBJECT,
              properties: {
                pollQuestion: { type: Type.STRING, description: "A highly engaging question to ask in Facebook/Reddit groups" },
                dmScript: { type: Type.STRING, description: "A non-salesy DM script to validate the idea with respondents" }
              }
            },
            blueprint: {
              type: Type.OBJECT,
              properties: {
                chapters: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5-6 catchy chapter/module titles for the PDF" }
              }
            },
            pricing: {
              type: Type.OBJECT,
              properties: {
                basic: { type: Type.STRING, description: "Basic tier pricing and what it includes (e.g., '$19 - PDF Only')" },
                pro: { type: Type.STRING, description: "Pro tier pricing and what it includes (e.g., '$49 - PDF + Templates')" },
                premium: { type: Type.STRING, description: "Premium tier pricing and what it includes (e.g., '$199 - PDF + 1-on-1 Call')" }
              }
            },
            launch: {
              type: Type.OBJECT,
              properties: {
                launchPlan: { type: Type.STRING, description: "A 2-sentence launch strategy" },
                emailSubject: { type: Type.STRING, description: "A high-open-rate subject line for the launch email" }
              }
            },
            pdfGenerationGuide: {
              type: Type.OBJECT,
              properties: {
                structure: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Step-by-step structure for the PDF content" },
                writingPrompt: { type: Type.STRING, description: "A master prompt to feed into an AI to write the content" },
                toolRecommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tools to use for formatting (e.g., Canva, Notion)" }
              }
            },
            pdfCoverGuide: {
              type: Type.OBJECT,
              properties: {
                visualConcept: { type: Type.STRING, description: "Description of the cover's visual layout and imagery" },
                colorPalette: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 hex codes (e.g., #FF5733)" },
                fontPairing: { type: Type.STRING, description: "Suggested font pairing (e.g., Playfair Display + Inter)" },
                canvaKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Keywords to search in Canva for templates/elements" }
              }
            }
          }
        }
      }
    });

    const text = response.text || '{}';
    return JSON.parse(text) as DetailedRoadmap;
  } catch (error) {
    console.error("Error generating roadmap from Gemini:", error);
    throw new Error("Failed to generate roadmap.");
  }
};
