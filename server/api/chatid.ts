import { v4 as uuidv4 } from 'uuid';

// 生成蓝心大模型会话ID (使用UUID)
export default defineEventHandler(async (event) => {
  return {
    chatid: uuidv4(), // 蓝心大模型使用UUID作为sessionId
  };
});