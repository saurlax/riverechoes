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
      <RouterLink to="/craft"><button>面塑</button></RouterLink>
    </div>
    <div class="text">满文（ᠮᠠᠨᠵᡠ
      ᡥᡝᡵᡤᡝᠨ）作为满族的独特文字，展现着深厚的历史文化底蕴。这独特的文字体系源自于传统的回鹘式蒙古文，经过满族智慧的创新与改进而形成。满文不仅仅是一种文字，更是清朝时期的法定文字，广泛用于各类文献、图书、档案、碑刻、谱牒等。在中国55个少数民族古籍文献中，满文数量丰富，种类繁多，为其中的佼佼者。这一文字体系在中国文字史的少数民族语言领域具有重要地位，不仅是中华民族文化遗产的重要组成部分，更承载着深厚的历史文化价值。
    </div>
    <canvas height="400px" ref="tabletRef" width="100px" @touchstart="draw" @touchmove="draw"></canvas>
    <div class="tip">点击进行书写</div>
  </div>
</template>

<style scoped>
.tip {
  position: fixed;
  bottom: 380px;
  font-size: 0.8rem;
  text-align: center;
  width: 100%;
}

canvas {
  position: fixed;
  bottom: 0;
  border-top: 1px dashed gray;
}
</style>