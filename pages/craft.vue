<script setup lang="ts">
import Ask from '../components/ChatBox.vue';

const load = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.style.width = img.offsetWidth * 0.2 + 'px'
}

const drag = (e: TouchEvent) => {
  e.preventDefault()
  const img = e.target as HTMLImageElement
  img.style.left = e.touches[0].clientX - img.offsetWidth / 2 + 'px'
  img.style.top = e.touches[0].clientY - img.offsetHeight / 2 + 'px'
}
</script>

<template>
  <div class="background">
    <div>
      <router-link to="/map"><button>返回</button></router-link>
      <router-link to="/calligraphy"><button>书法</button></router-link>
    </div>
    <ask class="box"
      defaultText="面塑以面粉、糯米粉、甘油或澄面等为主要原料，通过手工和专用塑形工具，经过捏、搓、压、揉、掀等手法，用小竹刀点、切、刻、划、塑成栩栩如生的艺术形象，如花、鸟、鱼、虫、景物、器物、人物、动物等。俗称面花、礼馍、花糕或捏面人。这一传统艺术在中国历史上有着悠久的渊源，汉代即有文字记载，而宜宾面塑更是在清末民初兴起，至今已有百余年历史。面塑艺术通过色彩搭配和巧妙的手法，展现了生动、灵活、富有创意的艺术形象，为中华文化传统的独特表达方式之一。" />
    <div class="workspace">
      <img v-for="n in 14" :alt="`part${n}`" :src="`/assets/craft/${n}.webp`" @load="load" @touchmove="drag" />
    </div>
    <div class="final">
      <div>拖动拼装面塑</div>
      <img src="/assets/craft/final.webp" @load="load" />
    </div>
  </div>
</template>

<style scoped>
.workspace {
  margin: 20px;
}

.workspace img {
  position: fixed;
}

.final {
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 0.8rem;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}
</style>