<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ask from '../components/ChatBox.vue'

const tabletRef = ref<HTMLCanvasElement>()
const textDivRef = ref<HTMLDivElement>()
let ctx: CanvasRenderingContext2D
let lastTouches: TouchList
let tablet: HTMLCanvasElement;

const currentManwenText = ref("ᠶᡝᡵᡠ")
const manwenTexts = ref([
  "ᠶᡝᠪᡴᡝᠯᡝᠮᠪᡳ",
  "ᠳᠤᠷᠠᠲᠠᠢ",
])

onMounted(() => {
  tablet = tabletRef.value!
  tablet.width = window.innerWidth
  tablet.height = 450; // 设定固定高度
  ctx = tablet.getContext('2d')!
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.fillStyle = '#fcf6ea'
  ctx.fillRect(0, 0, tablet.width, tablet.height)

  drawManwenText();
})

const drawManwenText = () => {
  ctx.clearRect(0, 0, tablet.width, tablet.height);
  ctx.fillStyle = '#fcf6ea';
  ctx.fillRect(0, 0, tablet.width, tablet.height);

  const textDiv = textDivRef.value!;
  textDiv.innerHTML = ''; // 清空之前的内容
  textDiv.style.color = 'rgba(128, 128, 128, 0.5)';
  textDiv.style.fontSize = '30px'; // 根据需要调整字体大小，避免越界
  textDiv.style.textAlign = 'center';
  textDiv.style.position = 'absolute';
  textDiv.style.width = '100%';
  textDiv.style.display = 'flex';
  textDiv.style.flexDirection = 'column'; // 使内容垂直排列
  textDiv.style.alignItems = 'center'; // 水平居中
  textDiv.style.top = `200px`; // 调整位置

  // 遍历满文字符，逐个添加到 textDiv 中
  for (let i = 0; i < currentManwenText.value.length; i++) {
    const charElement = document.createElement('div');
    charElement.textContent = currentManwenText.value[i];
    charElement.style.lineHeight = '1.2'; // 可以调整行高来控制字符间距
    textDiv.appendChild(charElement);
  }
};

const changeManwenText = () => {
  const randomIndex = Math.floor(Math.random() * manwenTexts.value.length);
  currentManwenText.value = manwenTexts.value[randomIndex];
  drawManwenText();
}

const draw = (e: TouchEvent) => {
  e.preventDefault();
  let el = e.target as any;

  let offsetX = 0;
  let offsetY = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    offsetX += el.offsetLeft - el.scrollLeft;
    offsetY += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
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
  ctx.clearRect(0, 0, tablet.width, tablet.height);
  ctx.fillStyle = '#fcf6ea';
  ctx.fillRect(0, 0, tablet.width, tablet.height);
  drawManwenText();
}
</script>

<template>
  <div class="background">
    <div>
      <router-link to="/map"><button>返回</button></router-link>
      <router-link to="/craft"><button>面塑</button></router-link>
      <button @click="clearCanvas">清空</button>
      <button @click="changeManwenText">换一段满文</button>
    </div>
    <ask class="box"
         defaultText="满文（ᠮᠠᠨᠵᡠ ᡥᡝᡵᡤᡝᠨ）作为满族的独特文字，展现着深厚的历史文化底蕴。这独特的文字体系源自于传统的回鹘式蒙古文，经过满族智慧的创新与改进而形成。满文不仅仅是一种文字，更是清朝时期的法定文字，广泛用于各类文献、图书、档案、碑刻、谱牒等。在中国55个少数民族古籍文献中，满文数量丰富，种类繁多，为其中的佼佼者。这一文字体系在中国文字史的少数民族语言领域具有重要地位，不仅是中华民族文化遗产的重要组成部分，更承载着深厚的历史文化价值。" />

    <canvas height="450px" ref="tabletRef" width="100%" @touchstart="draw" @touchmove="draw"></canvas>

    <div class="manwen-text" ref="textDivRef"></div>
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
  z-index: 1; /* 确保canvas在较低的层级 */
}

.manwen-text {
  position: absolute;
  width: 100%; /* 确保宽度充满画布 */
  text-align: center;
  color: rgba(128, 128, 128, 0.5);
  font-size: 40px;
  z-index: 2; /* 确保在 canvas 之上 */
  pointer-events: none;
  display: flex; /* 使用flex布局 */
  flex-direction: column; /* 垂直排列 */
  align-items: center; /* 水平居中 */
  justify-content: center; /* 垂直居中 */
  top: 0; /* 调整到合适的位置 */
  height: 100%; /* 占满整个高度 */
}

</style>