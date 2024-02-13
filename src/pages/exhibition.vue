<script setup lang="ts">
</script>

<template>
  <div class="item placeholder">展示的物品</div>
  <RouterLink to="/map"><button>返回</button></RouterLink>
  <RouterLink to="/vr"><button>VR模式</button></RouterLink>
</template>


<style scoped>
.item {
  height: 60px;
  position: fixed;
  right: 20%;
  bottom: 50%;
}
</style>