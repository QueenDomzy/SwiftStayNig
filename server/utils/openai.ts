import axios, { AxiosError } from "axios";

export async function callOpenAI(prompt: string): Promise<string> {
  try {
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

    return response.data?.choices?.[0]?.message?.content?.trim() || "⚠️ No response from AI model.";
  } catch (error: unknown) {
    console.error("OpenAI API error:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error?: { message?: string } }>;
      throw new Error(
        axiosError.response?.data?.error?.message || axiosError.message
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unknown OpenAI API error.");
  }
}
