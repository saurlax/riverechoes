<template>
  <div class="wrapper">
    <h1>辽河满韵</h1>
    <RouterLink to="/map"><button>开始游戏</button></RouterLink>
  </div>
</template>

<style scoped>
.wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

h1 {
  color: #212121;
  text-align: center;
  font-size: 3rem;
  filter: drop-shadow(2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 2px 2px 0 white);
}
</style>