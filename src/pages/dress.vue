<template>
  <div class="makeup-room">
    <div class="background"></div>
    <img class="character" :src="characterImage" alt="Character" @click="changeCharacter">

    <div class="buttons">
      <button @click="changeDecoration"><img src="decorationIcon" alt="Decoration"></button>
      <button @click="changeClothes"><img src="clothesIcon" alt="Clothes"></button>
      <button @click="changePants"><img src="pantsIcon" alt="Pants"></button>
      <button @click="changeShoes"><img src="shoesIcon" alt="Shoes"></button>
    </div>

    <button class="music-button" @click="toggleMusic"><img src="musicIcon" alt="Music"></button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      characterImage: 'path/to/defaultCharacterImage.jpg',
      decorationIcon: 'path/to/decorationIcon.png',
      clothesIcon: 'path/to/clothesIcon.png',
      pantsIcon: 'path/to/pantsIcon.png',
      shoesIcon: 'path/to/shoesIcon.png',
      musicIcon: 'path/to/musicIcon.png',
      isMusicPlaying: false,
      decorationOptions: ['decoration1', 'decoration1', 'decoration1', 'decoration1'], // 头饰选项数组
      clothingOptions: ['clothing1', 'clothing2', 'clothing3'], // 衣服选项数组
      pantsOptions: ['pants1', 'pants2', 'pants3'], // 裤子选项数组
      shoesOptions: ['shoes1', 'shoes2', 'shoes3'], // 鞋子选项数组
      decorationIndex: 0, //头饰选项索引
      clothingIndex: 0, // 衣服选项索引
      pantsIndex: 0, // 裤子选项索引
      shoesIndex: 0, // 鞋子选项索引
      characterOptions: ['path/to/character1.jpg', 'path/to/character2.jpg'], // 人物选项数组
      characterOptionIndex: 0 // 人物选项索引
    };
  },
  methods: {
    changeCharacter() {
      this.characterOptionIndex = (this.characterOptionIndex + 1) % this.characterOptions.length; // 更新人物选项索引
      this.characterImage = this.characterOptions[this.characterOptionIndex]; // 根据索引选择人物选项
    },
    changeDecoration() {
      this.decorationIndex = (this.decorationIndex + 1) % this.decorationOptions.length; // 更新头饰类型索引，循环回第一种头饰
      const selectedDecorationType = this.decorationTypes[this.decorationIndex]; // 根据索引选择头饰类型
      // 根据头饰类型选择相应的头饰图片
      switch (selectedDecorationType) {
        case 'type1':
          this.characterImage = 'path/to/type1DecorationImage.jpg';
          break;
        case 'type2':
          this.characterImage = 'path/to/type2DecorationImage.jpg';
          break;
        case 'type3':
          this.characterImage = 'path/to/type3DecorationImage.jpg';
          break;
        case 'type4':
          this.characterImage = 'path/to/type4DecorationImage.jpg';
          break;
      }
    },
    changeClothes() {
      this.clothingIndex = (this.clothingIndex + 1) % this.clothingOptions.length; // 更新衣服选项索引
      const selectedClothing = this.clothingOptions[this.clothingIndex]; // 根据索引选择衣服选项
      // 根据衣服选项选择相应的衣服图片
      switch (selectedClothing) {
        case 'clothing1':
          this.clothingImage = 'path/to/clothing1Image.jpg';
          break;
        case 'clothing2':
          this.clothingImage = 'path/to/clothing2Image.jpg';
          break;
        case 'clothing3':
          this.clothingImage = 'path/to/clothing3Image.jpg';
          break;
      }
    },
    changePants() {
      this.pantsIndex = (this.pantsIndex + 1) % this.pantsOptions.length; // 更新裤子选项索引
      const selectedPants = this.pantsOptions[this.pantsIndex]; // 根据索引选择裤子选项
      // 根据裤子选项选择相应的裤子图片
      switch (selectedPants) {
        case 'pants1':
          this.pantsImage = 'path/to/pants1Image.jpg';
          break;
        case 'pants2':
          this.pantsImage = 'path/to/pants2Image.jpg';
          break;
        case 'pants3':
          this.pantsImage = 'path/to/pants3Image.jpg';
          break;
      }
    },
    changeShoes() {
      this.shoesIndex = (this.shoesIndex + 1) % this.shoesOptions.length; // 更新鞋子选项索引
      const selectedShoes = this.shoesOptions[this.shoesIndex]; // 根据索引选择鞋子选项
      // 根据鞋子选项选择相应的鞋子图片
      switch (selectedShoes) {
        case 'shoes1':
          this.shoesImage = 'path/to/shoes1Image.jpg';
          break;
        case 'shoes2':
          this.shoesImage = 'path/to/shoes2Image.jpg';
          break;
        case 'shoes3':
          this.shoesImage = 'path/to/shoes3Image.jpg';
          break;
      }
    },
    toggleMusic() {
      this.isMusicPlaying = !this.isMusicPlaying; // 切换音乐播放状态
      if (this.isMusicPlaying) {
        this.playMusic(); // 播放音乐的方法
      } else {
        this.pauseMusic(); // 暂停音乐的方法
      }
    },
    playMusic() {
      const audio = new Audio('path/to/music.mp3'); // 创建音频对象，设置音乐文件路径
      audio.play(); // 播放音乐
    },
    pauseMusic() {
      const audio = document.querySelector('audio'); // 获取音频元素
      audio.pause(); // 暂停音乐
    },
  }
};
</script>

<style scoped>
.makeup-room {
  position: relative;
  /* 设置背景图样式 */
}

.background {
  /* 设置背景图样式 */
}

.character {
  position: absolute;
  /* 设置人物图样式 */
}

.buttons {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  /* 设置按钮样式 */
}

button {
  /* 设置按钮样式 */
}

.music-button {
  position: absolute;
  top: 20px;
  right: 20px;
  /* 设置音乐按钮样式 */
}
</style>
