import { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {
  return new Response('Hello, World!')
}

export const config = {
  path: "/api/hello",
  method: "GET",
}