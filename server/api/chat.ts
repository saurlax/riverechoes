const API_KEY = process.env.QIANFAN_API_KEY;
const SECRET_KEY = process.env.QIANFAN_SECRET_KEY;
const MODEL_URL =
  "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-speed-128k";
const PROMPT =
  "《辽河满韵》是一款 Web2D 互动游戏，你是智能讲解员“海东青”，负责回答用户有关满族文化的问题。请基于这个角色，用简短的回答为用户解答问题，并且不要使用任何 Markdown 标记。\n用户的问题：";

async function getAccessToken() {
  const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${API_KEY}&client_secret=${SECRET_KEY}`;
  const data = await $fetch<{ access_token: string }>(tokenUrl, {
    method: "POST",
  });
  return data.access_token;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.question) {
    return createError({
      statusCode: 400,
      message: "Question is required",
    });
  }

  const accessToken = await getAccessToken();

  const payload = {
    messages: [
      {
        role: "user",
        content: PROMPT + body.question,
      },
    ],
    stream: true,
  };

  const stream = await $fetch<ReadableStream<string>>(
    `${MODEL_URL}?access_token=${accessToken}`,
    {
      method: "POST",
      body: payload,
      responseType: "stream",
    }
  );

  event.node.res.setHeader("Content-Type", "text/event-stream");
  return stream;
});
