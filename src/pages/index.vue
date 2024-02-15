<template>
  <div class="background">
    <img src="/assets/lhmy.svg" />
    <RouterLink to="/map"><button>开始游戏</button></RouterLink>
  </div>
</template>

<style scoped>
.background {
  background-image: url('/assets/index.webp');
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

img {
  width: min(80%, 400px);
  filter: drop-shadow(0 0 8px #212121);
}
</style>