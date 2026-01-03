import { GoogleGenAI, Modality } from "@google/genai";
import { Language, Voice } from "../types";

// Helper to sanitize filename
export const sanitizeFilename = (text: string): string => {
  return text.replace(/[^a-z0-9à-žа-яё]/gi, '_').toLowerCase();
};

// Helper to delay execution (to avoid rate limits)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateSpeech = async (
  apiKey: string,
  word: string,
  language: Language,
  voice: Voice
): Promise<ArrayBuffer> => {
  if (!apiKey) throw new Error("API Key is required");

  // Initialize client with the USER PROVIDED key, not process.env
  const ai = new GoogleGenAI({ apiKey });

  // Construct a specific prompt to ensure correct language pronunciation
  const prompt = `Pronounce the following ${language} sentence clearly: "${word}"`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error("No audio data returned from Gemini API");
    }

    // Convert Base64 string to ArrayBuffer
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate speech");
  }
};