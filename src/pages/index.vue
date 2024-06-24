<script setup lang="ts">
import { onMounted, ref } from 'vue'

const loaded = ref(false)

onMounted(() => {
  window.onload = () => {
    loaded.value = true
  }
})
</script>

<template>
  <div class="background">
    <div class="content">
      <router-link v-if="loaded" to="/map"><button>开始游戏</button></router-link>
      <div v-else>加载中...</div>
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