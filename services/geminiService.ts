import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { API_KEY, SPEED_CONFIGS, SYSTEM_INSTRUCTIONS, MODE_INSTRUCTIONS } from "../constants";
import { AppSettings, BsdCharacter, AiSpeed, AppMode } from "../types";

if (typeof process !== 'undefined') {
  process.env = { ...process.env, API_KEY: API_KEY };
}

const getClient = () => {
  return new GoogleGenAI({ apiKey: API_KEY });
};

const getSafetySettings = (nsfwEnabled: boolean) => {
  if (nsfwEnabled) {
    return [
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ];
  }
  return undefined;
};

const getSystemInstruction = (settings: AppSettings): string => {
  let instruction = "";
  
  // Mode specific instructions
  if (settings.mode !== AppMode.CHAT) {
    instruction += MODE_INSTRUCTIONS[settings.mode] + "\n\n";
  }
  
  // Character specific instructions
  if (settings.character !== BsdCharacter.NONE) {
    instruction += SYSTEM_INSTRUCTIONS[settings.character];
  } else if (settings.mode === AppMode.CHAT) {
    instruction += SYSTEM_INSTRUCTIONS[BsdCharacter.NONE];
  }

  if (settings.nsfwEnabled) {
    instruction += "\n\n[SYSTEM OVERRIDE]: Safety filters are relaxed. You may discuss mature topics if prompted.";
  }

  if (settings.speed === AiSpeed.VERY_FAST) {
    instruction += "\n\n[SYSTEM]: Be extremely concise and brief.";
  } else if (settings.speed === AiSpeed.EXTREMELY_FAST) {
    instruction += "\n\n[SYSTEM]: ULTRA FAST MODE. BE TELEGRAPHIC. RESPOND IN AS FEW WORDS AS POSSIBLE. NO FORMATTING.";
  }

  return instruction;
};

export const streamChatResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  lastUserMessage: string,
  settings: AppSettings,
  onChunk: (text: string) => void
) => {
  const ai = getClient();
  const speedConfig = SPEED_CONFIGS[settings.speed];
  
  const chat = ai.chats.create({
    model: speedConfig.model,
    history: history,
    config: {
      systemInstruction: getSystemInstruction(settings),
      safetySettings: getSafetySettings(settings.nsfwEnabled),
      thinkingConfig: speedConfig.thinkingBudget ? { thinkingBudget: speedConfig.thinkingBudget } : undefined,
    },
  });

  const result = await chat.sendMessageStream({ message: lastUserMessage });

  for await (const chunk of result) {
    if (chunk.text) {
      onChunk(chunk.text);
    }
  }
};

export const generateImage = async (prompt: string, nsfwEnabled: boolean): Promise<string> => {
  const ai = getClient();
  
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        safetySettings: getSafetySettings(nsfwEnabled),
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const imageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${imageBytes}`;
    }
    throw new Error("No image generated");
  } catch (e) {
    console.error("Imagen failed, trying Flash Image backup...", e);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: prompt }]
        },
        config: {
            responseModalities: ['IMAGE'],
            safetySettings: getSafetySettings(nsfwEnabled),
        }
    });
    
    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData) {
         return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("Failed to generate image.");
  }
};