import { defineEventHandler, readBody } from 'h3';
import axios from 'axios';

// 百度 API Key 和 Secret Key
const API_KEY = process.env.BAIDU_API_KEY;
const SECRET_KEY = process.env.BAIDU_SECRET_KEY;

// 百度 API 的 URL
const MODEL_URL = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-speed-128k';

// 获取 Access Token
async function getAccessToken() {
  const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${API_KEY}&client_secret=${SECRET_KEY}`;
  const response = await axios.post(tokenUrl);
  return response.data.access_token;
}

// 用于保存多轮对话的历史记录
let conversationHistory = [
  {
    role: "user",
    content: "以下是对话背景信息：《辽河满韵》是一款 Web2D 互动游戏，你是智能讲解员“海东青”，负责回答用户有关满族文化的问题。请基于这个角色，用简短的回答为用户解答问题，并且不要使用任何 Markdown 标记。"
  }
];

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const question = body.question;

  // 如果问题为空，返回错误
  if (!question || question.trim() === '') {
    return { error: '问题不能为空' };
  }

  // 将用户的问题加入对话历史
  conversationHistory.push({ role: 'user', content: question });

// 保留最近的对话历史记录（限制为最近的 11 条消息）
  if (conversationHistory.length > 11) {
    // 只保留最新的 11 条消息
    conversationHistory = conversationHistory.slice(-11);
  }

  try {
    // 获取 Access Token
    const accessToken = await getAccessToken();

    // 构造请求体
    const payload = {
      messages: conversationHistory
    };

    // 调用百度 API
    const response = await axios.post(`${MODEL_URL}?access_token=${accessToken}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const assistantReply = response.data.result;

    // 将助手的回复加入对话历史
    conversationHistory.push({
      role: 'assistant',
      content: assistantReply
    });

    // 返回助手的回复
    return { answer: assistantReply };
  } catch (error: any) {  // 将 'unknown' 改为 'any'
    console.error('Error fetching response from ERNIE-Speed-128K:', error.response ? error.response.data : error.message);
    return { error: '无法获取回答，请重试。' };
  }
});