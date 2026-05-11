import { GoogleGenAI, Type } from '@google/genai';
import { Idea, DetailedRoadmap } from '../types';

// Initialize the Gemini API client
// Note: process.env.API_KEY must be available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

export const generateIdeas = async (topic: string, niche: string, count: number): Promise<Idea[]> => {
  const prompt = `
    You are an expert digital product researcher and SEO analyst building a "Market Gap PDF Generator".
    Your goal is to find underserved, monetizable intent clusters for PDF guides.
    
    Target Niche: ${niche}
    Specific Topic/Problem: ${topic || 'General trending problems in this niche'}
    
    Use Google Search to analyze current trends, Reddit pain points, TikTok/YouTube momentum, and SEO keyword difficulty gaps.
    Find exactly ${count} highly profitable PDF guide ideas that solve specific, urgent problems.
    
    Score them based on:
    - Search Volume (Demand)
    - Competition (Market gap)
    - Purchase Intent (Monetization potential)
    
    You MUST return the result as a raw JSON array of objects. Do not include any other text, markdown formatting, or explanations. Just the JSON array.
    
    Each object in the array must exactly match this structure:
    {
      "id": "unique-string-id",
      "title": "Catchy, specific title of the PDF guide",
      "description": "1-2 sentence description of what it solves and how",
      "audience": "Specific target audience",
      "difficulty": "Easy", // Must be exactly "Easy", "Medium", or "Hard"
      "interest": "High Interest", // Must be exactly "High Interest", "Med Interest", or "Low Interest"
      "competition": "Low Competition", // Must be exactly "Low Competition", "Med Competition", or "High Competition"
      "trend": "Rising", // Must be exactly "Rising", "Stable", or "Declining"
      "searchVolume": 15000, // Estimated monthly search volume (number)
      "opportunityScore": 92, // Score from 1 to 100 based on high demand + low competition
      "exampleQueries": ["query 1", "query 2", "query 3"], // 3 real-world search queries
      "monetizationAngles": ["14-day plan upsell", "Notion template bundle"], // 2-3 specific ways to monetize or upsell this PDF
      "dateGenerated": "${new Date().toISOString()}"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        // Enable Google Search grounding for real-time data
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType and responseSchema are NOT allowed when using googleSearch
      },
    });

    let text = response.text || '';
    
    // Clean up markdown code blocks if the model included them despite instructions
    text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

    const ideas: Idea[] = JSON.parse(text);
    
    // Ensure IDs are unique and format is correct
    return ideas.map((idea, index) => ({
      ...idea,
      id: idea.id || `gen-${Date.now()}-${index}`,
      monetizationAngles: idea.monetizationAngles || ['Gumroad PDF Sale', 'Email Newsletter Opt-in']
    }));
  } catch (error) {
    console.error("Error generating ideas from Gemini:", error);
    throw new Error("Failed to generate ideas. Please check your connection and try again.");
  }
};

export const generateIdeaRoadmap = async (idea: Idea): Promise<DetailedRoadmap> => {
  const prompt = `
    You are an expert digital product strategist and copywriter. 
    I have a validated PDF guide idea:
    
    Title: ${idea.title}
    Description: ${idea.description}
    Audience: ${idea.audience}
    
    Generate a detailed 7-stage execution roadmap to take this from idea to $10K in revenue.
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
            proposal: {
              type: Type.OBJECT,
              properties: {
                launchPlan: { type: Type.STRING, description: "A 2-sentence launch strategy" },
                emailSubject: { type: Type.STRING, description: "A high-open-rate subject line for the launch email" }
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
