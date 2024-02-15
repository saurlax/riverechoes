<script setup lang="ts">

</script>

<template>
  <div class="background">
    <RouterLink to="/dress"><button>梳妆</button></RouterLink>
    <RouterLink to="/craft"><button>工艺</button></RouterLink>
    <RouterLink to="/show"><button>表演</button></RouterLink>
    <RouterLink to="/exhibition"><button>展览</button></RouterLink>
    <RouterLink to="/sacrifice"><button>祭祀</button></RouterLink>
  </div>
</template>

<style scoped>
button {
  opacity: 0.6;
}

.background {
  background-image: url('/assets/map.webp');
}

.background a {
  position: absolute;
}

.background a:nth-child(1) {
  top: 30%;
  left: 20%;
}

.background a:nth-child(2) {
  top: 20%;
  left: 70%;
}

.background a:nth-child(3) {
  top: 60%;
  left: 40%;
}

.background a:nth-child(4) {
  top: 75%;
  left: 10%;
}

.background a:nth-child(5) {
  top: 90%;
  left: 70%;
}
</style>