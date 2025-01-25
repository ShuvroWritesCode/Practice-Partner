import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const getChatCompletion = async (messages) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages.map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      })),
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw error;
  }
};

export const generateImages = async (prompt) => {
  try {
    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: prompt,
      n: 4,
      size: "512x512",
      quality: "standard",
    });

    return response.data.map((image) => image.url);
  } catch (error) {
    console.error("OpenAI Image Generation Error:", error);
    throw error;
  }
};

export default openai;
