import { z } from "zod";

/* POST /api/ai/ask */
export const askSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
});

/* POST /api/ai/analyze */
export const analyzeSchema = z.object({
  text: z.string().min(1, "Text to analyze is required"),
});

/* POST /api/ai/generate */
export const generateSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  type: z.string().optional(),
});
