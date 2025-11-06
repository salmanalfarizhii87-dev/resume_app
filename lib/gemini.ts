import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const SYSTEM_INSTRUCTION = `You are 'RingkasCepat', a highly advanced AI summarization assistant. Your goal is to provide summaries that are clear, concise, accurate, and easy to understand. Follow the user's instructions for the summary format precisely. All responses should be in the same language as the input text.`;

export type SummaryStyle = "bullet_points" | "short_paragraph" | "explain_like_five";

function getPromptForStyle(style: SummaryStyle, content: string): string {
  const prompts: Record<SummaryStyle, string> = {
    bullet_points: `Based on the following text, provide the 3-5 most important key bullet points:\n\n${content}`,
    short_paragraph: `Summarize the following text into a single, well-written paragraph of approximately 100 words:\n\n${content}`,
    explain_like_five: `Explain the main idea of the following text as if you were talking to a 5-year-old child:\n\n${content}`,
  };

  return prompts[style];
}

export async function generateSummary(
  content: string,
  style: SummaryStyle
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const prompt = getPromptForStyle(style, content);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate summary. Please try again.");
  }
}
