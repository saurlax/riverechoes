<script setup lang="ts">
</script>

<template>
  <div class="background">
    <div class="item placeholder">展示的物品</div>
    <RouterLink to="/map"><button>返回</button></RouterLink>
    <RouterLink to="/vr"><button>VR模式</button></RouterLink>
  </div>
</template>


<style scoped>
.background {
  background-image: url('/assets/exhibition.jpg');
}

.item {
  height: 60px;
  position: fixed;
  right: 20%;
  bottom: 50%;
}
</style>