<script setup lang="ts">
import { reactive } from 'vue'
import ChatBox from '../components/ChatBox.vue';
import QuizComponent from '../components/QuizComponent.vue';
const state = reactive({
  time: 0,
  fire: 0
})

const change = (k: keyof typeof state) => {
  const max = { time: 1, fire: 2 }
  if (state[k] === max[k]) {
    state[k] = 0
  } else {
    state[k]++
  }
}
</script>
<template>
  <div class="background" :style="`background-image: url('/assets/ritual/time${state.time}.webp')`">
  <div class="header">
    <RouterLink to="/map"><button>返回</button></RouterLink>
    <button @click="change('time')">切换时间</button>
    <button @click="change('fire')">切换火焰</button>
    <QuizComponent pageContext="请生成关于满族萨满祭祀的多样化问题，可涉及：1)历史渊源(萨满教在满族文化中的地位及演变); 2)仪式类型(火祭、学祭等不同形式的特点与区别); 3)萨满角色(萨满的身份、服饰、法器及象征意义); 4)音乐舞蹈(祭祀中的乐器、节奏、舞蹈动作及其表达); 5)文化意义(人神关系、自然崇拜与生态观念); 6)与其他民族祭祀文化的比较; 7)现代传承与保护状况。问题可以是基础知识型、文化分析型、历史探究型或趣味民俗型，让学习者能全面理解这一独特的宗教文化现象。" />
  </div>
    <ChatBox class="box bottom"
      text="萨满祭祀是满族文化活动，包括火祭、学祭等形式。在祭祀中，萨满通过乐器、拍掌声、歌舞向神灵祈请降临，同时娱乐神灵和人们。歌词沟通人神关系，舞蹈表现萨满的虔诚与斗争。祭祀中设供进牲，献酒，擎神刀祷祝，歌舞热烈，达到请神以祈福佑的目的。" />
    <div class="fire" :style="`background-image: url('/assets/ritual/fire${state.fire}.webp')`"></div>
  </div>
</template>

<style scoped>
.fire {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  pointer-events: none;
}

.header {
  display: flex;
  align-items: center;
  padding: 10px;
}
</style>