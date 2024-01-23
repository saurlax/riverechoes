<script setup lang="ts">

</script>

<template>
  <div class="wrapper">
    <div class="map">
      <RouterLink to="/dress">梳妆</RouterLink>
      <RouterLink to="/craft">工艺</RouterLink>
      <RouterLink to="/show">表演</RouterLink>
      <RouterLink to="/exhibition">展览</RouterLink>
      <RouterLink to="/sacrifice">祭祀</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
  height: 100%;
  overflow: scroll;
}

.wrapper::-webkit-scrollbar {
  height: 0;
  width: 0;
}

.map {
  position: relative;
  height: 100%;
  background: center no-repeat;
  background-size: contain;
}

.map a {
  position: absolute;
}

.map a:nth-child(1) {
  top: 20%;
  left: 20%;
}

.map a:nth-child(2) {
  top: 40%;
  left: 60%;
}

.map a:nth-child(3) {
  top: 60%;
  left: 40%;
}

.map a:nth-child(4) {
  top: 75%;
  left: 10%;
}

.map a:nth-child(5) {
  top: 80%;
  left: 70%;
}
</style>