import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const chatService = {
  async sendMessage(message: string) {
    const res = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: message },
        ],
        max_tokens: 300,
    });
    return res.choices[0]?.message?.content || "No response";
  },
  
};
