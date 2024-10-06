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
    const stream = await $fetch<ReadableStream>('https://riverechoes.saurlax.com/api/chat', {
      method: 'POST',
      body: { question: question.value },
      responseType: "stream",
    })

    const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
    let readResult = await reader.read();
    answer.value = '';
    while (!readResult.done) {
      const data = JSON.parse(readResult.value.slice(6));
      answer.value += data.result;
      readResult = await reader.read();
    }
    question.value = '';
  } catch (e: any) {
    console.error(e);
    answer.value = e.data?.message ?? e.message ?? e;
  }
}
</script>

<template>
  <div v-bind="$attrs">
    <div class="upper">
      <input v-model="question" />
      <button @click="askQuestion">提问</button>
    </div>
    <div>{{ answer }}</div>
  </div>
</template>

<style scoped>
.upper {
  display: flex;
  justify-content: space-between;
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