<script setup lang="ts">

</script>

<template>
  <div class="wrapper">
    <div class="map">
      <RouterLink to="/dress"><button>梳妆</button></RouterLink>
      <RouterLink to="/craft"><button>工艺</button></RouterLink>
      <RouterLink to="/show"><button>表演</button></RouterLink>
      <RouterLink to="/exhibition"><button>展览</button></RouterLink>
      <RouterLink to="/sacrifice"><button>祭祀</button></RouterLink>
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