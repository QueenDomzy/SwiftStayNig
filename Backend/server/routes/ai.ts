import express, { Request, Response } from "express";
import dotenv from "dotenv";
import axios, { AxiosError } from "axios";

dotenv.config();
const router = express.Router();

/* 🤖 Health Check Route */
router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "🤖 AI routes active",
    endpoints: ["/ask", "/analyze", "/generate"],
  });
});

/**
 * @route   POST /api/ai
 * @desc    Generate AI-based suggestions or messages
 * @access  Public (can be secured later with authentication middleware)
 */
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "Prompt is required." });
      return;
    }

    // ✅ Example: call OpenAI’s API (replace model as needed)
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply =
      response.data?.choices?.[0]?.message?.content?.trim() ||
      "⚠️ No response from AI model.";

    res.status(200).json({
      message: "✅ AI response generated successfully.",
      reply: aiReply,
    });
  } catch (error: unknown) {
    console.error("AI route error:", error);

    // 🧩 Handle Axios errors gracefully
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error?: { message?: string } }>;
      const errorMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.response?.data ||
        axiosError.message;

      res.status(502).json({
        error: "AI API request failed.",
        details: errorMessage,
      });
      return;
    }

    // 🧩 Handle generic errors
    if (error instanceof Error) {
      res.status(500).json({
        error: "AI processing failed.",
        details: error.message,
      });
      return;
    }

    // 🧩 Fallback
    res.status(500).json({ error: "Unknown AI service error." });
  }
});

export default router;
