<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  defaultText: string
}>()
const answer = ref(props.defaultText)
const question = ref('')

// 定义发送请求的函数
const askQuestion = async () => {
  if (!question.value.trim()) return;

  try {
    const stream = await $fetch<ReadableStream>('/api/chat', {
      method: 'POST',
      body: { question: question.value },
      responseType: "stream",
    })

    const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
    let chunk = await reader.read();
    answer.value = '';
    while (!chunk.done) {
      console.log(chunk.value);
      chunk.value.trim().split('\n').forEach((text: string) => {
        // remove the first 6 characters "data: "
        if (text) {
          const data = JSON.parse(text.slice(6));
          answer.value += data.result;
        }
      })
      chunk = await reader.read();
    }
    question.value = '';
  } catch (e: any) {
    console.error(e);
    answer.value = e.data?.message ?? e.message ?? e;
  }
}

const speakText = async () => {
  speak(answer.value);
}
</script>

<template>
  <div v-bind="$attrs">
    <div class="upper">
      <input v-model="question" />
      <button @click="askQuestion">提问</button>
      <button @click="speakText">语音讲解</button>
    </div>
    <div>{{ answer }}</div>
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
  flex-grow: 1;
  display: block;
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