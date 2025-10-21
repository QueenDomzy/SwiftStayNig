import express, { Request, Response } from "express";
import dotenv from "dotenv";
import axios, { AxiosError } from "axios";

dotenv.config();
const router = express.Router();

/**
 * @route   POST /api/ai
 * @desc    Generate AI-based suggestions or messages
 * @access  Public or Protected
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    // Example: call an external AI API (replace with your model or logic)
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

    const aiReply = response.data.choices?.[0]?.message?.content || "No response";

    res.json({ reply: aiReply });
  } catch (error: unknown) {
    // Narrow unknown type safely
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("AI route error:", axiosError.response?.data || axiosError.message);
    } else if (error instanceof Error) {
      console.error("AI route error:", error.message);
    } else {
      console.error("AI route error:", error);
    }
    res.status(500).json({ message: "AI service error" });
  }
});

export default router;
