<script setup lang="ts">
import { onMounted, ref } from 'vue'

const loaded = ref(false)
const size = ref(0)

onMounted(() => {
  window.onload = () => {
    loaded.value = true
  }
  setTimeout(() => {
    loaded.value = true
  }, 2000)
  new PerformanceObserver((list) => {
    let s = 0
    list.getEntries().forEach((entry: any) => {
      s += entry.transferSize ?? 0
    })
    size.value = size.value + s
  }).observe({ entryTypes: ['resource'] })
})
</script>

<template>
  <div class="background">
    <div class="content">
      <router-link v-if="loaded" to="/map"><button>开始游戏</button></router-link>
      <div v-else>加载中({{ (size / 1000).toFixed(2) }}KB)</div>
    </div>
  </div>
</template>

<style scoped>
.background {
  background-image: url('/assets/index.webp');
}

button {
  padding: 30px 50px;
  background-color: initial;
  background-image: url('/assets/start.webp');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.content {
  position: absolute;
  width: 100%;
  bottom: 20%;
  display: flex;
  justify-content: center;
  text-align: center;
}
</style>