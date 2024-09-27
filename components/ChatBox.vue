<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps<{
  defaultText: string
}>()
const text = ref(props.defaultText)
const question = ref('')

// 定义发送请求的函数
const askQuestion = async () => {
  if (question.value.trim() === '') return; // 如果问题为空，则不发送请求

  try {
    // 调用在 server/api/chat.ts 中定义的 API
    const response = await axios.post('/api/chat', { question: question.value });
    text.value = response.data.answer || '无法获取回答';
  } catch (error) {
    console.error('Error:', error);
    text.value = '请求出错，请重试';
  }

  question.value = ''; // 清空输入框
}
</script>

<template>
  <div v-bind="$attrs">
    <div class="upper">
      <input v-model="question" />
      <button @click="askQuestion">提问</button>
    </div>
    <div>{{ text }}</div>
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