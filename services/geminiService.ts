import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse, GenerationResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateContent = async (articleText: string): Promise<GenerationResult> => {
  try {
    // Step 1: Analyze text and generate a creative image prompt and tags.
    const analysisResponse = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: `Analyze the following blog post content. Based on its core message, keywords, and emotional tone (e.g., formal, technical, casual, inspirational, futuristic), generate two things:

1. A detailed, evocative prompt for an image generation AI to create a 16:9 header image. The prompt should describe a visually appealing scene, abstract concept, or stylized typography. It should specify the style (e.g., 'minimalist vector art', 'photorealistic', 'abstract gradient background'), color palette (e.g., 'dark mode with neon blue accents'), and overall mood. If the article has a clear title, incorporate it as stylized text within the image description. Any text included in the image must be in English.

2. An array of exactly 5 relevant tags for the blog post, optimized for SEO.

Blog Post Content:
---
${articleText}
---`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            imagePrompt: {
              type: Type.STRING,
              description: "A detailed prompt for the image generation model."
            },
            tags: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              },
              description: "An array of exactly 5 SEO-optimized tags."
            }
          },
          required: ["imagePrompt", "tags"]
        }
      }
    });

    const analysisResult: GeminiResponse = JSON.parse(analysisResponse.text);

    if (!analysisResult.imagePrompt || !analysisResult.tags || analysisResult.tags.length === 0) {
      throw new Error("Failed to get a valid analysis from the AI.");
    }
    
    // Step 2: Generate the image using the prompt from Step 1.
    const imageResponse = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: analysisResult.imagePrompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9',
        outputMimeType: 'image/png'
      }
    });

    const base64ImageBytes = imageResponse.generatedImages[0]?.image?.imageBytes;
    if (!base64ImageBytes) {
      throw new Error("Image generation failed.");
    }
    const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
    
    // Step 3: Format tags and return the final result.
    const tags = analysisResult.tags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ');

    return { imageUrl, tags };

  } catch (error) {
    console.error("Error in Gemini service:", error);
    if (error instanceof Error) {
        throw new Error(`AI generation failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred during AI generation.");
  }
};