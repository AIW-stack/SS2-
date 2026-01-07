
import { GoogleGenAI, Type } from "@google/genai";
import { Subscription, ExploreInsight } from "../types";

// Always initialize the client with an API key from process.env.API_KEY
// Use a named parameter as required by the latest SDK guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface RecommendationResponse {
  recommendations: any[];
  sources: { title: string; uri: string }[];
}

export interface ExploreResponse {
  insights: ExploreInsight[];
  sources: { title: string; uri: string }[];
}

// Get AI-powered savings recommendations using Search Grounding.
// Uses 'gemini-3-pro-preview' as this is a complex reasoning task involving financial analysis.
export const getSmartRecommendations = async (subscriptions: Subscription[], persona: string): Promise<RecommendationResponse> => {
  const prompt = `
    Analyze these user subscriptions for a user in India with the persona: ${persona}.
    Identify financial leaks, unused subscriptions, or better alternatives based on cost vs usage.
    ALSO, use your search tool to check if there are any recent price hikes for these services in India (2024-2025) or better competing offers (like family plans or bundles).
    
    Subscriptions: ${JSON.stringify(subscriptions.map(s => ({ 
      name: s.name, 
      amount: s.amount, 
      usageLevel: s.usageLevel, 
      usageMinutes: s.usageMinutes, 
      category: s.category 
    })))}
    
    Return a JSON array of recommendations.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              potentialSavings: { type: Type.NUMBER },
              type: { type: Type.STRING, enum: ['Cancel', 'Downgrade', 'Duplicate', 'Family', 'Pause'] },
              actionLabel: { type: Type.STRING }
            },
            required: ["id", "title", "description", "potentialSavings", "type", "actionLabel"]
          }
        }
      }
    });

    // Access the .text property directly to get the generated string output.
    const recommendations = JSON.parse(response.text || "[]");
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));

    return { recommendations, sources };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { recommendations: [], sources: [] };
  }
};

// Get market insights using Search Grounding, combining current affairs with user usage.
// Uses 'gemini-3-pro-preview' for advanced reasoning about market trends and current affairs.
export const getExploreInsights = async (subscriptions: Subscription[]): Promise<ExploreResponse> => {
  const activeSubs = subscriptions.filter(s => s.status === 'Active').map(s => ({ name: s.name, usage: s.usageLevel }));
  const pausedSubs = subscriptions.filter(s => s.status === 'Paused').map(s => s.name);
  
  const prompt = `
    You are a high-level digital finance consultant in India.
    Combine user usage data with LATEST CURRENT AFFAIRS (News, Sports, Tech releases in 2024-2025) to provide actionable insights.
    
    User Data:
    - Active: ${JSON.stringify(activeSubs)}
    - Paused: ${JSON.stringify(pausedSubs)}

    CRITICAL SEARCH: Search for recent Swiggy platform fee hikes or price increases in India (late 2024/2025). This is a high-priority insight for the user.
    
    Search for other:
    1. Major events in India (IPL 2024/2025, ICC, Big movie releases, festive seasons) where a subscription might be WORTH IT.
    2. Negative news or price spikes for their current low-usage active apps where UNSUBSCRIBING is recommended.
    3. Better bundle offers based on recent market shifts (e.g. Jio/Airtel new bundles).

    Return a JSON array of ExploreInsight objects. For "actionType", use 'Subscribe' if you recommend a new one, 'Unsubscribe' if they should quit an active one, 'Pause' if it's seasonal, or 'None' for info only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              sourceLabel: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['Price Hike', 'New Deal', 'Trending', 'Alternative', 'Current Affair'] },
              actionType: { type: Type.STRING, enum: ['Subscribe', 'Unsubscribe', 'Pause', 'None'] },
              targetService: { type: Type.STRING },
              relevance: { type: Type.STRING },
              ctaLabel: { type: Type.STRING },
              icon: { type: Type.STRING }
            },
            required: ["id", "title", "description", "sourceLabel", "type", "actionType", "targetService", "relevance", "ctaLabel"]
          }
        }
      }
    });

    // Directly access the .text property from the response object.
    const insights = JSON.parse(response.text || "[]");

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));

    return { insights, sources };
  } catch (error) {
    console.error("Gemini Explore Error:", error);
    return { insights: [], sources: [] };
  }
};
