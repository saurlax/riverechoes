<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  text: string
}>()
const chatid = ref('')
const answer = ref(props.text)
const question = ref('')
const currentQuestion = ref('')
const answerDelta = ref('')
const loading = ref(false)

onMounted(async () => {
  chatid.value = localStorage.getItem('chatid') ?? ''

  if (!chatid.value) {
    const data = await $fetch<{ chatid: string }>('/api/chatid');
    chatid.value = data.chatid;
    localStorage.setItem('chatid', chatid.value);
  }
})

onMounted(() => {
  setInterval(() => {
    if (answerDelta.value) {
      answer.value += answerDelta.value.slice(0, 5);
      answerDelta.value = answerDelta.value.slice(5);
    }
  }, 50);
})

const askQuestion = async () => {
  if (!question.value.trim()) return;

  try {
    currentQuestion.value = question.value;
    const stream = await $fetch<ReadableStream>('/api/chat', {
      method: 'POST',
      body: {
        chatid: chatid.value,
        question: question.value
      },
      responseType: "stream",
    })

    const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
    loading.value = true;
    let chunk = await reader.read();
    answer.value = '';
    while (!chunk.done) {
      console.log(chunk.value);
      chunk.value.trim().split('\n').forEach((text: string) => {
        if (text) {
          try {
            const data = JSON.parse(text.slice(6));
            answerDelta.value += data.answer;
          } catch { }
        }
      })
      chunk = await reader.read();
    }
    question.value = '';
  } catch (e: any) {
    console.error(e);
    answer.value += e.data?.message ?? e.message ?? e;
  }
  loading.value = false;
}

const speakText = async () => {
  speak(answer.value);
}
</script>

<template>
  <div class="chatbox" v-bind="$attrs">
    <div class="upper">
      <input v-model="question" />
      <button @click="askQuestion">提问</button>
      <button @click="speakText">语音讲解</button>
    </div>
    <div>
      <span v-if="loading">（思考中）</span>
      <span>{{ answer }}</span>
    </div>
  </div>
</template>

<style scoped>
.upper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

button {
  font-size: 0.8rem;
}

input {
  width: 100px;
  flex-grow: 1;
  box-sizing: border-box;
  outline: none;
  padding: 4px;
  border: 1px solid #bdbdbd;
}

input:hover,
input:focus {
  border-color: #757575;
}
</style>