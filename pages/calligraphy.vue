<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ask from '../components/ChatBox.vue'

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
  let el = e.target as any

  // 获取元素相对于页面的偏移量
  let offsetX = 0
  let offsetY = 0
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    offsetX += el.offsetLeft - el.scrollLeft
    offsetY += el.offsetTop - el.scrollTop
    el = el.offsetParent
  }

  if (e.type === 'touchstart') lastTouches = e.touches
  for (const i of e.touches) {
    ctx.beginPath()
    ctx.lineWidth = i.force
    ctx.moveTo(lastTouches[i.identifier].clientX - offsetX, lastTouches[i.identifier].clientY - offsetY)
    ctx.lineTo(i.clientX - offsetX, i.clientY - offsetY)
    ctx.stroke()
    lastTouches = e.touches
  }
}
</script>

<template>
  <div class="background">
    <div>
      <router-link to="/map"><button>返回</button></router-link>
      <router-link to="/craft"><button>面塑</button></router-link>
    </div>
    <ask class="box"
      defaultText="满文（ᠮᠠᠨᠵᡠ ᡥᡝᡵᡤᡝᠨ）作为满族的独特文字，展现着深厚的历史文化底蕴。满文广泛用于各类文献、图书、档案、碑刻、谱牒等。在中国55个少数民族古籍文献中，满文数量丰富，种类繁多，为其中的佼佼者。这一文字体系在中国文字史的少数民族语言领域具有重要地位，不仅是中华民族文化遗产的重要组成部分，更承载着深厚的历史文化价值。" />

    <canvas height="400px" ref="tabletRef" width="100px" @touchstart="draw" @touchmove="draw"></canvas>
    <div class="facsimile">ᠪᡳᠶᠠᠩᡤᠠ ᡳᠨᡝᠩᡤᡳ ᡠᡵᡤᡠᠨ ᠣᡴᡳᠨᡳ</div>
    <div class="tip">点击进行书写</div>
  </div>
</template>

<style scoped>
.tip {
  position: absolute;
  bottom: 380px;
  font-size: 0.8rem;
  text-align: center;
  width: 100%;
  pointer-events: none;
}

.facsimile {
  font-size: 2rem;
  color: red;
  opacity: 0.4;
  position: absolute;
  bottom: 0;
  padding: 20px;
  box-sizing: border-box;
  height: 400px;
  width: 100%;
  writing-mode: vertical-rl;
  pointer-events: none;
}

canvas {
  position: absolute;
  bottom: 0;
  border-top: 1px dashed gray;
}
</style>