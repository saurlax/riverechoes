<template>
  <div class="background">
    <RouterLink to="/map"><button>开始游戏</button></RouterLink>
    <!-- <div class="copy">© 2024 大连理工大学软件学院、大连理工大学-立命馆大学国际信息与软件学院赴吉林省四平市“石榴花开，籽籽同心”寒假社会实践团</div> -->
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
  position: fixed;
  width: 100%;
  bottom: 20%;
  display: flex;
  justify-content: center;
}

.copy {
  font-size: 0.6rem;
  position: fixed;
  bottom: 0;
  margin: 6px;
  text-align: center;
}
</style>