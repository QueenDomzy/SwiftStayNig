import express, { Request, Response } from "express";
import { callOpenAI } from "../utils/openai";
import { AskRequest, AnalyzeRequest, GenerateRequest, AIResponse, AIErrorResponse } from "../types/ai";

const router = express.Router();

/* 🤖 Health Check */
router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "🤖 AI routes active",
    endpoints: ["/ask", "/analyze", "/generate"],
  });
});

/* POST /api/ai/ask */
router.post("/ask", async (req: Request<{}, {}, AskRequest>, res: Response<AIResponse | AIErrorResponse>) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt is required." });

  try {
    const reply = await callOpenAI(prompt);
    res.status(200).json({ message: "✅ Answer generated successfully.", reply });
  } catch (error: unknown) {
    res.status(500).json({
      error: "AI processing failed.",
      details: error instanceof Error ? error.message : undefined,
    });
  }
});

/* POST /api/ai/analyze */
router.post("/analyze", async (req: Request<{}, {}, AnalyzeRequest>, res: Response<AIResponse | AIErrorResponse>) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "Text to analyze is required." });

  try {
    const prompt = `Analyze the following text and provide key insights:\n\n${text}`;
    const reply = await callOpenAI(prompt);
    res.status(200).json({ message: "✅ Analysis generated successfully.", reply });
  } catch (error: unknown) {
    res.status(500).json({
      error: "AI analysis failed.",
      details: error instanceof Error ? error.message : undefined,
    });
  }
});

/* POST /api/ai/generate */
router.post("/generate", async (req: Request<{}, {}, GenerateRequest>, res: Response<AIResponse | AIErrorResponse>) => {
  const { prompt, type } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt is required." });

  try {
    const finalPrompt = type
      ? `Generate a ${type} based on the following prompt:\n\n${prompt}`
      : prompt;

    const reply = await callOpenAI(finalPrompt);
    res.status(200).json({ message: "✅ Content generated successfully.", reply });
  } catch (error: unknown) {
    res.status(500).json({
      error: "AI content generation failed.",
      details: error instanceof Error ? error.message : undefined,
    });
  }
});

export default router;
