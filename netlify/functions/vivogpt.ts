import type { Config, Context } from "@netlify/functions"
import { vivogpt } from "../vivoapi"

export default async (req: Request, context: Context) => {
  const body = await req.json()
  if (body.password !== process.env.PASSWORD) {
    return new Response("Unauthorized", { status: 401 })
  }
  const systemPrompt = "你是《辽河满韵》的AI助手，专门为玩家提供关于满族文化的相关内容。请以连贯的段落形式回答，避免使用列表或条目。你的回答应该是一段文字，限制在100字以内。"
  const res = await vivogpt(body.prompt, systemPrompt)
  return new Response(res)
}

export const config: Config = {
  path: "/api/vivogpt",
  method: "POST",
}