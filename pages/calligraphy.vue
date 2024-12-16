<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ChatBox from '../components/ChatBox.vue'

const tabletRef = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D
let lastTouches: TouchList

const facsimileTexts = ref([
  "ᠭᠤᠷᠪᠠᠨ ᠵᠢᠯ᠎ᠦ᠋ᠨ ᠠᠶᠠᠨᠴᠢᠨ᠎ᠢ᠋ ᠬᠣᠷᠢᠭᠰᠠᠨ ᠥᠨᠥᠳᠥᠷ ᠪᠠᠰᠠ ᠯᠠ ᠡᠮᠦᠨᠡᠬᠢ ᠮᠠᠩᠯᠠᠢ᠎ᠲᠠᠢ ᠪᠣᠯᠪᠠ ᠃  ᠬᠢᠵᠠᠭᠠᠷ ᠦᠭᠡᠢ ᠠᠭᠤᠯᠠ ᠤᠰᠤᠨ᠎ᠤ᠋ ᠨᠢᠯᠪᠤᠰᠤ ᠂ ᠲᠩᠷᠢ ᠭᠠᠵᠠᠷ᠎ᠤ᠋ᠨ ᠠᠭᠤᠳᠠᠮ ᠡᠰᠡᠬᠦ᠎ᠶ᠋ᠢ ᠬᠡᠨ ᠮᠡᠳᠡᠬᠦ ᠪᠣᠢ ᠃  ᠪᠤᠯᠠᠭ᠎ᠢ᠋ ᠮᠡᠳᠡᠭᠰᠡᠨ ᠬᠥᠮᠦᠨ᠎ᠦ᠌ ᠵᠠᠮ ᠣᠢᠷ᠎ᠠ ᠂ ᠨᠤᠲᠤᠭ᠎ᠢ᠋ ᠬᠦᠰᠡᠭᠰᠡᠨ ᠬᠥᠮᠦᠨ ᠬᠣᠯᠠ ᠃  ᠰᠥᠰᠥ ᠵᠣᠷᠢᠭ ᠬᠠᠷᠢᠵᠤ ᠢᠷᠡᠬᠦ ᠡᠳᠦᠷ ᠂ ᠰᠦᠯᠳᠡ ᠬᠣᠰᠢᠭᠤ ᠬᠣᠭᠣᠰᠣᠨ ᠦᠵᠡᠨ᠎ᠡ ᠃  ", // 另一种满文
  "ᠭᠠᠵᠠᠷ ᠳᠦᠭᠦᠷᠡᠩ ᠬᠢᠷᠠᠭᠤ ᠴᠠᠰᠤ ᠰᠢᠭ᠋ ᠥᠳᠬᠡᠨ ᠃ ᠬᠥᠮᠦᠨ ᠦᠭᠡ᠎ᠪᠡᠷ ᠂ ᠬᠦᠯᠦᠭ ᠡᠪᠡᠰᠦ᠎ᠪᠡᠷ ᠃ ᠨᠢᠭᠡ ᠮᠤᠷᠤᠢ ᠴᠠᠭᠠᠨ ᠪᠣᠭᠣᠮᠲᠠ ᠲᠤᠢᠯ᠎ᠳ᠋ᠠᠭᠠᠨ ᠲᠤᠯᠤᠭᠠᠳᠤᠢ ᠃ ᠲᠡᠷᠭᠡᠨ᠎ᠦ᠌ ᠳᠠᠭᠤ ᠨᠠᠮ ᠵᠢᠮ ᠪᠣᠯᠪᠠ ᠃ ᠲᠩᠷᠢ᠎ᠶ᠋ᠢᠨ ᠬᠠᠶᠠᠭ᠎ᠠ ᠡᠪᠡᠰᠦ ᠃ ᠬᠠᠷ᠎ᠠ ᠨᠡᠮᠡᠷᠢ ᠂ ᠬᠠᠭᠤᠴᠢᠨ ᠵᠢᠯ᠎ᠦ᠋ᠨ ᠮᠡᠬᠡ ᠃ ᠥᠪᠡᠷ᠎ᠢ᠋ᠶ᠋ᠡᠨ ᠴᠦ᠍ ᠬᠡᠯᠡᠵᠦ ᠪᠣᠯᠣᠰᠢ ᠦᠭᠡᠢ ᠬᠡᠷᠡᠭ ᠃ ᠬᠥᠮᠦᠨ᠎ᠦ᠌ ᠶᠢᠷᠲᠢᠨᠴᠦ᠎ᠶ᠋ᠢᠨ ᠬᠠᠮᠤᠭ ᠲᠦᠷᠦᠭᠦᠨ᠎ᠳ᠋ᠦ᠍ ᠰᠠᠯᠤᠯᠲᠠ ᠬᠢᠨ᠎ᠡ ᠃  ", // 另一种满文
  "ᠪᠣᠷᠣᠭᠠᠨ ᠳᠤᠰᠤᠯ ᠴᠡᠴᠡᠭ ᠪᠤᠲᠠᠷᠠᠨ ᠂ ᠤᠯᠠᠭᠠᠨ ᠠᠩᠬᠢᠯᠤᠮ᠎ᠠ ᠦᠨᠦᠷ ᠰᠡᠩᠭᠢᠨᠡᠬᠦ ᠴᠥᠭᠥᠷᠥᠮ᠎ᠦ᠋ᠨ ᠬᠣᠶᠠᠷ ᠡᠷᠭᠢ ᠃ ᠪᠢᠲᠡᠭᠡᠢ ᠬᠣᠯᠠ᠎ᠶ᠋ᠢ ᠬᠠᠷᠠ ᠂ ᠬᠠᠪᠤᠷ᠎ᠤ᠋ᠨ ᠬᠤᠭᠤᠰ ᠂ ᠮᠥᠩᠭᠥᠨ ᠬᠠᠯᠬᠠᠪᠴᠢ᠎ᠪᠠᠨ ᠨᠤᠤᠬ᠎ᠠ ᠃  ᠥᠨᠥᠴᠢᠨ ᠹᠠᠨ ᠡᠷᠲᠡ ᠣᠷᠣᠢ ᠦᠭᠡᠢ ᠭᠤᠷᠪᠠᠨ ᠴᠤᠭᠤᠷ᠎ᠠ᠋ᠴᠠ ᠰᠠᠯᠤᠨ᠎ᠠ ᠂ ᠰᠤᠯᠠ ᠪᠠᠢᠳᠠᠭ ᠳ᠋ᠢᠶᠠᠨ ᠰᠢᠪᠠᠭᠤ ᠬᠡᠳᠦᠨ ᠬᠡᠰᠡᠭ ᠪᠤᠬᠢᠨᠢᠳᠤᠨ᠎ᠠ ᠃ ᠠᠶ᠎ᠠ ᠳᠣᠲᠣᠷᠠᠬᠢ ᠰᠡᠳᠬᠢᠯᠭᠡ ᠂ ᠴᠢᠪᠬᠠᠳᠠᠰᠤ ᠦᠭᠡ ᠂ ᠰᠣᠨᠣᠰᠬᠤ᠎ᠳ᠋ᠤ᠌ ᠠᠶ᠎ᠠ ᠦᠭᠡᠢ !︕  " // 另一种满文
]);

const currentIndex = ref(0); // 当前显示的满足的索引

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

const clearCanvas = () => {
  ctx.clearRect(0, 0, tabletRef.value!.width, tabletRef.value!.height);
  ctx.fillStyle = '#fcf6ea';
  ctx.fillRect(0, 0, tabletRef.value!.width, tabletRef.value!.height);
}

// 切换满文内容的函数
const toggleFacsimile = () => {
  currentIndex.value = (currentIndex.value + 1) % facsimileTexts.value.length; // 循环切换
  clearCanvas();
}
</script>

<template>
  <div class="background">
    <div>
      <RouterLink to="/map"><button>返回</button></RouterLink>
      <RouterLink to="/craft"><button>面塑</button></RouterLink>
      <button @click="clearCanvas">清空画布</button>
      <button @click="toggleFacsimile">切换满文</button> <!-- 增加切换按钮 -->
    </div>
    <ChatBox class="box"
      text="满文（ᠮᠠᠨᠵᡠ ᡥᡝᡵᡤᡝᠨ）作为满族的独特文字，展现着深厚的历史文化底蕴。满文广泛用于各类文献、图书、档案、碑刻、谱牒等。在中国55个少数民族古籍文献中，满文数量丰富，种类繁多，为其中的佼佼者。这一文字体系在中国文字史的少数民族语言领域具有重要地位，不仅是中华民族文化遗产的重要组成部分，更承载着深厚的历史文化价值。" />

    <canvas height="400px" ref="tabletRef" width="100px" @touchstart="draw" @touchmove="draw"></canvas>
    <div class="facsimile">{{ facsimileTexts[currentIndex] }}</div>
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
