<template>
  <div class="wrapper">
    <div class="map"></div>
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
  width: 120%;
  height: 120%;
  background: center no-repeat;
  background-size: contain;
}
</style>