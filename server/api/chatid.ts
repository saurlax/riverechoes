async function createChat() {
  const data = await $fetch<{ conversation_id: string }>(
    "https://qianfan.baidubce.com/v2/app/conversation",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Appbuilder-Authorization": `Bearer ${process.env.APPBUILDER_TOKEN}`,
      },
      body: {
        app_id: process.env.APPBUILDER_APP_ID,
      },
    }
  );
  return data.conversation_id;
}

export default defineEventHandler(async (event) => {
  return {
    chatid: await createChat(),
  };
});
