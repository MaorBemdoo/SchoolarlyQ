"use server";

import OpenAI from "openai";
import ResponseHandler from "@/utils/ResponseHandler";
import initLogger from "@/config/logger";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function sendChatMessage(message: string) {
  const logger = await initLogger();
  try {
    if (!message || message.trim() === "") {
      return ResponseHandler("failed", "Message cannot be empty");
    }

    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
      max_tokens: 300,
    });

    const reply = res.choices[0]?.message?.content || "No response";

    return ResponseHandler("success", "Message sent successfully", reply);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error(error, "Error in sendChatMessage:");
    return ResponseHandler("failed", error.message || "Error sending message");
  }
}
