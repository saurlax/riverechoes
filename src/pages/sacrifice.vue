<script setup lang="ts">
import { reactive } from 'vue'
const state = reactive({
  time: 0,
  fire: 0
})

const change = (k: keyof typeof state) => {
  const max = { time: 1, fire: 2 }
  if (state[k] === max[k]) {
    state[k] = 0
  } else {
    state[k]++
  }
}
</script>
<template>
  <div class="background" :style="`background-image: url('/src/assets/sacrifice/time${state.time}.webp')`">
    <router-link to="/map"><button>返回</button></router-link>
    <button @click="change('time')">切换时间</button>
    <button @click="change('fire')">切换火焰</button>
    <div class="text">
      萨满祭祀是满族文化活动，包括火祭、学祭等形式。在祭祀中，萨满通过乐器、拍掌声、歌舞向神灵祈请降临，同时娱乐神灵和人们。歌词沟通人神关系，舞蹈表现萨满的虔诚与斗争。祭祀中设供进牲，献酒，擎神刀祷祝，歌舞热烈，达到请神以祈福佑的目的。
    </div>
    <div class="fire" :style="`background-image: url('/src/assets/sacrifice/fire${state.fire}.webp')`"></div>
  </div>
</template>

<style scoped>
.fire {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  pointer-events: none;
}

.text {
  background: #ffffff88;
  position: absolute;
  bottom: 0;
}
</style>