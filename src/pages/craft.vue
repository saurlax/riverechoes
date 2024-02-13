<script setup lang="ts">
import { onMounted, ref } from 'vue'

const tabletRef = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D
let lastTouches: TouchList

onMounted(() => {
  const tablet = tabletRef.value!
  tablet.width = window.innerWidth
  ctx = tablet.getContext('2d')!
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.fillStyle = '#fcf6ea'
  ctx.fillRect(0, 0, tablet.width, tablet.height)
})

const draw = (e: TouchEvent) => {
  e.preventDefault()
  const t = e.target as HTMLCanvasElement
  if (e.type === 'touchstart') lastTouches = e.touches
  for (const i of e.touches) {
    ctx.beginPath()
    ctx.lineWidth = i.force
    ctx.moveTo(lastTouches[i.identifier].clientX - t.offsetLeft, lastTouches[i.identifier].clientY - t.offsetTop)
    ctx.lineTo(i.clientX - t.offsetLeft, i.clientY - t.offsetTop)
    ctx.stroke()
    lastTouches = e.touches
  }
}


</script>

<template>
  <div class="background">
    <div>
      <RouterLink to="/map"><button>返回</button></RouterLink>
    </div>
    <canvas height="400px" ref="tabletRef" width="100px" @touchstart="draw" @touchmove="draw"></canvas>
  </div>
</template>

<style scoped>
.background {
  background-image: url('/assets/craft.jpg');
  height: calc(100vh - 400px);
}

canvas {
  position: fixed;
  bottom: 0;
}
</style>