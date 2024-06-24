<script setup lang="ts">
import { ref } from 'vue'
const item = ref(0)
const info = [
  { name: '骨刻柳树神神偶', desc: '骨刻神偶是满族早期祭祀物，后成挂饰辟邪。制作需动物骨头，手艺濒失。江汉力用鱼骨刻成，手工独特。神偶代表不同类型神祇，制作需多重工序，近期用现代工具打磨，呈现光滑逼真。神偶最初为梦境幻想，后有具体形象。请神仪式中，萨满祭祀后神偶灵验。传承300余年，因年代久远和神秘性，面临失传。' },
  { name: '清代嵌宝石累丝如意', desc: '如意起源于印度爪杖，明清制作，以清代居多，质地包括金、银、铜、珐琅、竹木、玉等。无实用功能，用于祈福、禳安、驱邪。清宫中备受推崇，节庆日进贡。装饰有掐金丝回纹、嵌松石、珊瑚、宝石等，头部祥云状，纹饰包括道教和佛教元素，彰显文化融和。展示了精湛工艺和宽容文化。' },
  { name: '清乾隆祭江铜水禽', desc: '清乾隆皇帝东巡祭祀松花江神所用水禽文物，鸭子状，青铜材质，肥硕饱满，羽片栩栩如生。背部有蛙纹，翅上刻蛇纹，象征吉祥、富贵、权利。清乾隆十九年（1754年）东巡至吉林，祭祀松花江，祈求国泰民安。代表乾隆时期的宗教信仰和文化价值，寓意吉祥富贵，传承千年。' },
  { name: '太平鼓', desc: '太平鼓，北方曲艺形式，男性演员用铁条制成的羊皮单鼓，击打伴舞，流行于明清，用于祭祀、舞蹈。舞者手持鼓，右手鞭打，表演活泼多样。曲艺流行于安徽、甘肃、宁夏、陕西等地，北京称为“迎年鼓”。清乾隆皇帝东巡祭祀松花江时使用。解放后，经革新表现欢乐情绪。舞具为羊皮单面鼓，柄下悬铁环。演出形式多样，鼓点短促清晰，舞姿健康朴实，流行于年节庆典。' }]

const change = () => {
  if (item.value < 3) {
    item.value++
  } else {
    item.value = 0
  }
}
</script>

<template>
  <div class="background">
    <div>
      <router-link to="/map"><button>返回</button></router-link>
      <router-link to="/vr"><button>VR模式</button></router-link>
      <button @click="change">切换展品</button>
    </div>
    <div class="item" :style="`background-image: url('/src/assets/exhibition/${item}.webp')`"></div>
    <div class="text">
      <b>{{ info[item].name }}</b>
      <div>{{ info[item].desc }}</div>
    </div>
  </div>
</template>


<style scoped>
.background {
  background-image: url('/src/assets/exhibition/background.webp');
}

.item {
  position: absolute;
  width: 160px;
  height: 160px;
  right: 10%;
  bottom: 35%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  filter: drop-shadow(0 0 10px gray);
}

.text {
  position: absolute;
  bottom: 0;
  background: #ffffff88;
}
</style>