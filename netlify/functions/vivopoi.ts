import type { Config, Context } from "@netlify/functions"
import { vivopoi } from "../vivoapi"

export default async (req: Request, context: Context) => {
  const body = await req.json()
  if (body.password !== process.env.PASSWORD) {
    return new Response("Unauthorized", { status: 401 })
  }
  const res = await vivopoi(body.keywords, "大连市")
  return new Response(JSON.stringify(res), {
    headers: {
      "content-type": "application/json",
    },
  })
}

export const config: Config = {
  path: "/api/vivopoi",
  method: "POST",
}