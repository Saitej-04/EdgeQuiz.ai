import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, QuizQuestion } from '../types';

// Initialize Gemini Client
// Note: API Key must be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuizQuestions = async (difficulty: Difficulty, count: number = 5): Promise<QuizQuestion[]> => {
  const model = 'gemini-2.5-flash';

  const prompt = `Generate ${count} multiple-choice cricket quiz questions. 
  Difficulty Level: ${difficulty}.
  Focus on international cricket (Tests, ODIs, T20s), famous players, historic moments, and rules.
  Ensure the "Googly" difficulty includes obscure stats or tricky rule interpretations.
  
  Return strictly JSON.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: "You are a cricket expert and trivia master. Your questions should be accurate, engaging, and diverse.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 4 options"
              },
              correctAnswerIndex: { 
                type: Type.INTEGER, 
                description: "0-based index of the correct answer" 
              },
              explanation: { type: Type.STRING, description: "Short interesting fact explaining the answer" }
            },
            required: ["question", "options", "correctAnswerIndex", "explanation"],
            propertyOrdering: ["question", "options", "correctAnswerIndex", "explanation"]
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data as QuizQuestion[];
    }
    
    throw new Error("No data received from Gemini");

  } catch (error) {
    console.error("Failed to generate questions:", error);
    throw error;
  }
};
