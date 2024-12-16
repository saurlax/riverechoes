async function streamChat(chatid: string, query: string) {
  return await $fetch("https://qianfan.baidubce.com/v2/app/conversation/runs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Appbuilder-Authorization": `Bearer ${process.env.APPBUILDER_TOKEN}`,
    },
    body: {
      app_id: process.env.APPBUILDER_APP_ID,
      conversation_id: chatid,
      query,
      stream: true,
    },
    responseType: "stream",
  });
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const stream = await streamChat(body.chatid, body.question);
  event.node.res.setHeader("Content-Type", "text/event-stream");
  return stream;
});
