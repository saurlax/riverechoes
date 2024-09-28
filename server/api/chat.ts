import { defineEventHandler, readBody } from 'h3';
import OpenAI from "openai";

// 创建 OpenAI 客户端实例
const client = new OpenAI({
  apiKey: process.env.MOONSHOT_API_KEY,    // 从环境变量中获取 API Key
  baseURL: "https://api.moonshot.cn/v1",   // Kimi API 的基础 URL
});

// 用于存储对话历史的数组
let history: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
  {
    role: "system",
    content: "《辽河满韵》是一款 Web2D 互动游戏，你是智能讲解员“海东青”，负责回答用户有关满族文化的问题。你的回答应为一段简短的话，不要使用任何 Markdown 标记。"
  }
];

const askAI = async (): Promise<{ role: string; content: string | null }> => {
  try {
    // 调用 OpenAI API 生成对话内容
    const completion = await client.chat.completions.create({
      model: "moonshot-v1-8k",
      messages: history as Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
      temperature: 0.3
    });
    return completion.choices[0].message;
  } catch (error: any) {
    if (error.status === 429) {
      console.warn("Rate limit hit, retrying in 1 second...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      return askAI(); // 递归重试
    }
    throw error;
  }
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event); // 获取请求体
  const userPrompt = body.question; // 提取用户问题

  // 将用户的问题添加到对话历史中
  history.push({ role: "user", content: userPrompt });

  // 保留最近的5轮对话（每轮包含一条用户消息和一条 AI 回复，共两条）
  if (history.length > 11) {
    history.shift(); // 移除最早的一条对话记录
  }

  try {
    // 获取 AI 的回复
    const aiResponse = await askAI();

    // 将 AI 回复添加到对话历史
    history.push({
      role: aiResponse.role as 'system' | 'user' | 'assistant',
      content: aiResponse.content ?? '' // 如果 content 为 null，则设置为空字符串
    });

    // 返回 AI 的回答
    return { answer: aiResponse.content };
  } catch (error) {
    console.error("Error fetching response:", error);
    return { error: "Failed to get response from Kimi AI." };
  }
});
