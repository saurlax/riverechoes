<script setup lang="ts">

</script>

<template>
  <div class="background">
    <router-link to="/dressing"><button>梳妆</button></router-link>
    <router-link to="/craft"><button>工艺</button></router-link>
    <router-link to="/performance"><button>表演</button></router-link>
    <router-link to="/exhibition"><button>展览</button></router-link>
    <router-link to="/ritual"><button>祭祀</button></router-link>
  </div>
</template>

<style scoped>
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