<script setup lang="ts">
</script>

<template>
  <div class="background">
    <RouterLink to="/map"><button>开始游戏</button></RouterLink>
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

a {
  position: absolute;
  width: 100%;
  bottom: 20%;
  display: flex;
  justify-content: center;
}
</style>