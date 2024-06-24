<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const assets = import.meta.glob('/src/assets/**/*.webp', { eager: false, as: 'url' })
const loadCurrent = ref('')
const loadCount = ref(0)
const loadTotal = Object.keys(assets).length
const loadState = computed(() => loadCount.value / loadTotal * 100)

onMounted(() => {
  Object.entries(assets).forEach(async ([path, resolve]) => {
    const img = new Image()
    img.onload = () => {
      loadCurrent.value = path
      loadCount.value += 1
    }
    img.src = await resolve()
  })
})
</script>

<template>
  <div class="background">
    <div class="content">
      <div v-if="loadState >= 100">
        <router-link to="/map"><button>开始游戏</button></router-link>
      </div>
      <div v-else>
        <div>加载中...({{ loadState.toFixed(2) }}%)</div>
        <div>{{ loadCurrent }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.background {
  background-image: url('/src/assets/index.webp');
}

button {
  padding: 30px 50px;
  background-color: initial;
  background-image: url('/src/assets/start.webp');
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