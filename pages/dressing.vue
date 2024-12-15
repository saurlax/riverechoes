<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import ask from '../components/ChatBox.vue'
import html2canvas from 'html2canvas'
const state = reactive({ a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0 })
const data = computed(() => {
  return Object.entries(state).filter(([_, v]) => v).map(([k, v]) => `background-image: url('/assets/dress/${k}${v}.webp')`
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
        // 排除 .switch 和 ask 组件的元素
        return element.matches('button') || element.matches('.box');
      }
    }).then((canvas) => {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'dressing.png';
      link.click();
    }).catch((error) => {
      alert(`保存失败：${error}`);
    });
  }
};

</script>

<template>
  <div class="background" ref="saveArea">
    <router-link to="/map"><button>返回</button></router-link>
    <ask class="box"
      defaultText="满族服饰历史悠久，起源可追溯至7000年前。上世纪30年代，男女穿直筒式大袖长袍，女性旗袍有花卉纹饰。40年代后，受时尚影响，男性旗袍废弃，女性旗袍变为窄袖、贴身、收腰，袍长及踝。" />
    <div class="layers">
      <div class="base"></div>
      <div v-for="i in data" :style="i"></div>
    </div>
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
  background-image: url('/assets/dress/base.webp');
}

.switch {
  width: 64px;
  display: inline-flex;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>