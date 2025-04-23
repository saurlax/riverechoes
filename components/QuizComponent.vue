<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  pageContext: string; // 当前页面的上下文信息，用于生成相关问题
}>();

const showQuiz = ref(false);
const isLoading = ref(false);
const question = ref('');
const options = ref<string[]>([]);
const correctAnswer = ref(-1);
const selectedAnswer = ref(-1);
const explanation = ref('');
const chatid = ref('');
const responseText = ref('');
const deltaText = ref('');

onMounted(async () => {
  chatid.value = localStorage.getItem('chatid') ?? '';

  if (!chatid.value) {
    const data = await $fetch<{ chatid: string }>('/api/chatid');
    chatid.value = data.chatid;
    localStorage.setItem('chatid', chatid.value);
  }
  
  // 处理流式响应
  setInterval(() => {
    if (deltaText.value) {
      responseText.value += deltaText.value.slice(0, 10);
      deltaText.value = deltaText.value.slice(10);
      parseQuizData(responseText.value);
    }
  }, 50);
});

const parseQuizData = (text: string) => {
  try {
    // 查找JSON格式的数据
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const quizData = JSON.parse(jsonMatch[0]);
      if (quizData.question && Array.isArray(quizData.options) && 
          typeof quizData.correctAnswer === 'number' && quizData.explanation) {
        question.value = quizData.question;
        
        // 清理选项中可能存在的字母标签
        options.value = quizData.options.map(option => {
          // 移除开头的字母标签，如"A. "、"A："、"A、"等各种格式
          return option.replace(/^[A-D][.、:：\s]+/i, '');
        });
        
        correctAnswer.value = quizData.correctAnswer;
        explanation.value = quizData.explanation;
        return true;
      }
    }
  } catch (e) {
    console.log('解析JSON失败，等待更多数据');
  }
  return false;
};

const generateQuiz = async () => {
  if (isLoading.value) return;
  
  isLoading.value = true;
  showQuiz.value = true;
  selectedAnswer.value = -1;
  question.value = '';
  options.value = [];
  correctAnswer.value = -1;
  explanation.value = '';
  responseText.value = '';
  deltaText.value = '';
  
  try {
    const promptText = `根据这个主题"${props.pageContext}"，生成一道适合趣味答题的问题，并提供四个选项（其中只有一个正确选项）。请用以下JSON格式返回：
    {
      "question": "问题内容",
      "options": ["选项内容1", "选项内容2", "选项内容3", "选项内容4"],
      "correctAnswer": 正确选项的索引(0-3),
      "explanation": "正确答案的解释"
    }
    重要：不要在选项内容中包含A、B、C、D等标签前缀，因为前端会自动添加。例如选项内容应该是"选项内容"而不是"A. 选项内容"。仅返回JSON数据，不要添加任何额外解释。`;
    const stream = await $fetch<ReadableStream>('/api/chat', {
      method: 'POST',
      body: {
        chatid: chatid.value,
        question: promptText
      },
      responseType: "stream",
    });

    const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
    let chunk = await reader.read();
    
    while (!chunk.done) {
      chunk.value.trim().split('\n').forEach((text: string) => {
        if (text && text.startsWith('data: ')) {
          try {
            const data = JSON.parse(text.slice(6));
            if (data.answer) {
              deltaText.value += data.answer;
            }
          } catch {}
        }
      });
      chunk = await reader.read();
    }
  } catch (error) {
    console.error('生成问题失败:', error);
    question.value = '抱歉，生成问题时出错了';
    options.value = [];
  } finally {
    isLoading.value = false;
  }
};

const selectOption = (index: number) => {
  if (selectedAnswer.value !== -1) return; // 已经选择过答案
  selectedAnswer.value = index;
};

const closeQuiz = () => {
  showQuiz.value = false;
};
</script>

<template>
  <div>
    <button @click="generateQuiz" :disabled="isLoading">趣味答题</button>
    
    <div v-if="showQuiz" class="quiz-container">
      <button class="absolute-close-btn" @click="closeQuiz">×</button>
      
      <div class="quiz-header">
        <h3>趣味答题</h3>
      </div>
      
      <div v-if="isLoading" class="loading">
        正在生成问题...
      </div>
      
      <template v-else-if="question">
        <p class="question">{{ question }}</p>
        
        <div class="options">
            <div 
  v-for="(option, index) in options" 
  :key="index"
  class="option"
  :class="{
    'selected': selectedAnswer === index,
    'correct': selectedAnswer !== -1 && index === correctAnswer,
    'incorrect': selectedAnswer === index && selectedAnswer !== correctAnswer
  }"
  @click="selectOption(index)"
>
  <span class="option-label">{{ ['A', 'B', 'C', 'D'][index] }}.</span>
  <span class="option-text">{{ option }}</span>
  <span v-if="selectedAnswer === index && selectedAnswer === correctAnswer" class="result correct">✓</span>
  <span v-if="selectedAnswer === index && selectedAnswer !== correctAnswer" class="result incorrect">×</span>
  <span v-if="selectedAnswer !== -1 && selectedAnswer !== index && index === correctAnswer" class="result correct">✓</span>
</div>
        </div>
        
        <div v-if="selectedAnswer !== -1 && selectedAnswer !== correctAnswer" class="correct-answer">
          <p>正确答案: {{ ['A', 'B', 'C', 'D'][correctAnswer] }}</p>
          <p>{{ explanation }}</p>
        </div>
        
        <div v-if="selectedAnswer === correctAnswer" class="explanation">
          <p>{{ explanation }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.quiz-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  background-color: rgba(255, 255, 255, 0.9); /* 半透明白色背景 */
  background-image: url('../assets/back.png'); /* 更新为正确的背景图路径 */
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay; /* 混合模式让背景图和颜色混合 */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
  z-index: 1000;
}

/* 可以根据背景图情况调整以下样式，提高文字可读性 */
.question, .option-text, .explanation p, .correct-answer p {
  color: #333;
  font-weight: 500;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.8); /* 添加轻微文字阴影增强可读性 */
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.quiz-header h3 {
  margin: 0;
}

.loading, .error {
  text-align: center;
  padding: 20px;
}

.error {
  color: #f44336;
}

.question {
  font-size: 16px;
  margin-bottom: 16px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option {
  display: flex;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
}

.option:hover {
  background-color: #f5f5f5;
}

.option.selected {
  border-color: #4caf50;
}

.option.correct {
  background-color: rgba(76, 175, 80, 0.1);
  border-color: #4caf50;
  border-width: 2px;
}

.option.incorrect {
  background-color: rgba(244, 67, 54, 0.1);
  border-color: #f44336;
  border-width: 2px;
}

.option-label {
  font-weight: bold;
  margin-right: 8px;
}

.option-text {
  flex: 1;
}

.result {
  position: absolute;
  right: 10px;
  font-weight: bold;
}

.result.correct {
  color: #4caf50;
}

.result.incorrect {
  color: #f44336;
}

.correct-answer, .explanation {
  margin-top: 16px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.correct-answer {
  border-left: 3px solid #f44336;
}

.explanation {
  border-left: 3px solid #4caf50;
}

.absolute-close-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  z-index: 1001;
  transition: all 0.2s;
}

.absolute-close-btn:hover {
  background-color: #f44336;
  color: white;
  border-color: #f44336;
}
</style>