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

  background: #dacab1;
}

h1 {
  color: white;
  text-align: center;
  font-size: 3rem;
  text-shadow: 0 0 4px black;
}
</style>