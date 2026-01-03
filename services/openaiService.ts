import { Language, Voice } from "../types";

export const sanitizeFilename = (text: string): string => {
  return text.replace(/[^a-z0-9à-žа-яё]/gi, '_').toLowerCase();
};

export const generateSpeech = async (
  apiKey: string,
  word: string,
  language: Language,
  voice: Voice
): Promise<ArrayBuffer> => {
  if (!apiKey) throw new Error("API Key is required");

  // OpenAI TTS endpoint
  const url = "https://api.openai.com/v1/audio/speech";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1", // 'tts-1' is the standard model. 'tts-1-hd' is also available.
      input: word,
      voice: voice.toLowerCase(), // OpenAI voices are lowercase
      response_format: "mp3"
    }),
  });

  if (!response.ok) {
    let errorMessage = `OpenAI API Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      }
    } catch (e) {
      // Ignore JSON parse error if body is not JSON
    }
    throw new Error(errorMessage);
  }

  return await response.arrayBuffer();
};