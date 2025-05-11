<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import ChatBox from '../components/ChatBox.vue'
import QuizComponent from '../components/QuizComponent.vue';
import html2canvas from 'html2canvas'
const state = reactive({ a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0 })
const data = computed(() => {
  return Object.entries(state).filter(([_, v]) => v).map(([k, v]) => `background-image: url('/assets/costume/${k}${v}.webp')`
  )
})

const change = (k: keyof typeof state) => {
  const max = { a: 2, b: 2, c: 3, d: 2, e: 1, f: 1, g: 1 }
  if (state[k] === max[k]) {
    state[k] = 0
  } else {
    state[k]++
  }
}

// 获取保存区域的引用
const saveArea = ref<HTMLElement | null>(null)

// 图片保存功能
const saveImage = () => {
  if (saveArea.value) {
    html2canvas(saveArea.value, {
      ignoreElements: (element) => {
        // 排除 .switch 和 ChatBox 组件的元素
        return element.matches('button') || element.matches('.box');
      }
    }).then((canvas) => {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'costume.png';
      link.click();
    }).catch((error) => {
      alert(`保存失败：${error}`);
    });
  }
};

</script>

<template>
  <div class="background" ref="saveArea">
    <div class="header">
      <RouterLink to="/map"><button>返回</button></RouterLink>
      <QuizComponent
        pageContext="请生成关于满族传统服饰的多样化问题，可涉及：1)历史演变(服饰的起源、发展与社会历史背景); 2)结构特点(不同部件如帽饰、服饰、鞋饰、首饰等的造型与功能); 3)材质工艺(用料选择、制作工艺与装饰技法); 4)纹样象征(图案寓意、颜色象征与身份表达); 5)性别差异(男女服饰的区别与社会文化意义); 6)节庆与日常(不同场合的着装规范); 7)与周边民族服饰的比较; 8)现代传承与创新应用。问题可以是基础知识型、工艺鉴赏型、文化分析型、历史探究型或趣味民俗型，让学习者能够全面了解满族服饰的多元文化内涵与艺术价值。" />
    </div>
    <div class="layers">
      <div class="base"></div>
      <div v-for="i in data" :style="i"></div>
    </div>
    <ChatBox class="box"
      text="满族服饰历史悠久，起源可追溯至7000年前。上世纪30年代，男女穿直筒式大袖长袍，女性旗袍有花卉纹饰。40年代后，受时尚影响，男性旗袍废弃，女性旗袍变为窄袖、贴身、收腰，袍长及踝。" />
    <div class="switch">
      <button @click="change('a')">帽饰{{ state.a }}</button>
      <button @click="change('b')">服饰{{ state.b }}</button>
      <button @click="change('c')">鞋饰{{ state.c }}</button>
      <button @click="change('d')">手绢{{ state.d }}</button>
      <button @click="change('e')">头饰{{ state.e }}</button>
      <button @click="change('f')">首饰{{ state.f }}</button>
      <button @click="change('g')">手饰{{ state.g }}</button>
      <button @click="saveImage">保存</button>
    </div>
  </div>
</template>

<style scoped>
.layers {
  z-index: 1;
  width: 100%;
  height: 100%;
  /* 添加高度 */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.header {
  display: flex;
  align-items: center;
  padding: 10px;
  position: relative;  /* 添加定位 */
  z-index: 30;  /* 增加z-index，确保它高于所有其他元素 */
  pointer-events: auto;  /* 确保可以接收点击事件 */
}

.header :deep(.quiz-component) {  /* 使用:deep穿透子组件 */
  position: relative;
  z-index: 30;
  pointer-events: auto;
}

.layers div {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  pointer-events: none;
}

.base {
  background-image: url('/assets/costume/base.webp');
}

.switch {
  width: 64px;
  display: inline-flex;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 10;
}

.header {
  display: flex;
  align-items: center;
  padding: 10px;
}
.header button {
  position: relative;
  z-index: 20; /* 确保按钮有足够高的z-index */
  pointer-events: auto; /* 确保按钮可点击 */
  cursor: pointer; /* 添加鼠标指针样式 */
}
.box {
  position: relative;
  z-index: 10;
  /* 添加这一行确保ChatBox在图层上方 */
}

</style>