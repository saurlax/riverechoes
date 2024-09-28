<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ask from '../components/ChatBox.vue'

const tabletRef = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D
let lastTouches: TouchList

// 当前满文文本
const currentManwenText = ref("ᠬᠠᠪᠤᠷ ᠤ᠋ᠨ ᠥᠷᠯᠥᠭᠡ")

// 满文文本数组
const manwenTexts = ref([
  "ᠬᠠᠪᠤᠷ᠎ᠤ᠋ᠨ ᠤᠷᠢ",
  "ᠳᠤᠷᠠᠲᠠᠢ"
])

onMounted(() => {
  const tablet = tabletRef.value!
  tablet.width = window.innerWidth
  ctx = tablet.getContext('2d')!
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.fillStyle = '#fcf6ea'
  ctx.fillRect(0, 0, tablet.width, tablet.height)

  // 初始化绘制满文
  drawManwenText();
})

const drawManwenText = () => {
  ctx.clearRect(0, 0, tabletRef.value!.width, tabletRef.value!.height); // 清空画布
  ctx.fillStyle = 'rgba(128, 128, 128, 0.5)'; // 设置文本颜色
  ctx.font = '40px SimSun'; // 设置字体和大小
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 计算文本的起始位置
  const startX = tabletRef.value!.width / 2;
  const startY = tabletRef.value!.height / 5;

  // 将文本竖直排布
  for (let i = 0; i < currentManwenText.value.length; i++) {
    ctx.fillText(currentManwenText.value[i], startX, startY + (i * 20)); // 每个字符向下移动20像素
  }
}

const changeManwenText = () => {
  const randomIndex = Math.floor(Math.random() * manwenTexts.value.length);
  currentManwenText.value = manwenTexts.value[randomIndex]; // 随机选择新文本
  drawManwenText(); // 重新绘制满文
}

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
  ctx.clearRect(0, 0, tabletRef.value!.width, tabletRef.value!.height)
  ctx.fillStyle = '#fcf6ea'
  ctx.fillRect(0, 0, tabletRef.value!.width, tabletRef.value!.height) // 重绘背景
  drawManwenText(); // 重新绘制满文文本
}


</script>

<template>
  <div class="background">
    <div>
      <router-link to="/map"><button>返回</button></router-link>
      <router-link to="/craft"><button>面塑</button></router-link>
      <button @click="clearCanvas">清空</button>
    <button @click="changeManwenText">换一段满文</button> <!-- 修改按钮功能 -->
    </div>
    <ask class="box"
      defaultText="满文（ᠮᠠᠨᠵᡠ ᡥᡝᡵᡤᡝᠨ）作为满族的独特文字，展现着深厚的历史文化底蕴。这独特的文字体系源自于传统的回鹘式蒙古文，经过满族智慧的创新与改进而形成。满文不仅仅是一种文字，更是清朝时期的法定文字，广泛用于各类文献、图书、档案、碑刻、谱牒等。在中国55个少数民族古籍文献中，满文数量丰富，种类繁多，为其中的佼佼者。这一文字体系在中国文字史的少数民族语言领域具有重要地位，不仅是中华民族文化遗产的重要组成部分，更承载着深厚的历史文化价值。" />
    <canvas height="450px" ref="tabletRef" width="100px" @touchstart="draw" @touchmove="draw"></canvas>
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
}

canvas {
  position: absolute;
  bottom: 0;
  border-top: 1px dashed gray;
}


</style>