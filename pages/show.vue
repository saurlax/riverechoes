<script setup lang="ts">
import ChatBox from '../components/ChatBox.vue';
import QuizComponent from '../components/QuizComponent.vue';
</script>

<template>
  <div class="background">
    <div class="header">
    <RouterLink to="/map"><button>返回</button></RouterLink>
    <QuizComponent pageContext="请生成关于满族传统秧歌舞的多样化问题，可涉及：1)历史起源(秧歌舞在满族文化中的发展历程); 2)表演特点(表演者角色、音乐、服饰特色); 3)文化意义(与农耕文化、节庆的关系); 4)与其他民族舞蹈的比较; 5)现代传承情况。问题可以是知识性的、分析性的或有趣的民俗小知识，使学习者能够全面了解满族秧歌舞这一独特的民间艺术形式。" />
  </div>
    <ChatBox class="box bottom"
      text="满族传统的秧歌舞，又称扭秧歌或闹秧歌，是一项富有特色的民间歌舞艺术。这种群众性歌舞在满族社区中极为盛行，尤其在逢年过节，尤其是正月十五元宵节时更是热闹非凡。各村屯都会组织秧歌队，走街串巷，进行表演，为节日增添喜庆氛围。秧歌表演者的扮相丰富多彩，包括文人书生、老翁老妪等各种角色，形成了一场生动有趣的舞蹈和歌唱的盛宴。在表演中，歌舞交错，既有动感的舞步，又有富有情感的歌唱，呈现出丰富多样的文化内涵。" />
    <div class="layers">
      <div class="actors"></div>
      <div class="particles"></div>
      <div class="notes"></div>
    </div>
  </div>
</template>

<style scoped>
.background {
  background-image: url('/assets/show/background.webp');
}

.layers div {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  pointer-events: none;
}


@keyframes swing {
  0% {
    transform: skew(-10deg);
  }

  50% {
    transform: scaleY(0.9);
  }

  100% {
    transform: skew(10deg);
  }

}

.actors {
  background-image: url('/assets/show/actors.webp');
  animation: swing 1s linear infinite alternate;
}

@keyframes float {
  0% {
    transform: translate(0, 0)
  }

  50% {
    transform: translate(-5px, 8px);
  }

  100% {
    transform: translate(10px, 16px);
  }
}

.notes {
  background-image: url('/assets/show/notes.webp');
  animation: float 1s linear infinite alternate;
}

@keyframes rotate {
  0% {
    transform: rotateZ(-10deg);
  }

  100% {
    transform: rotateZ(10deg);
  }
}

.particles {
  background-image: url('/assets/show/particles.webp');
  animation: rotate 1s linear infinite alternate;
}

.header {
  display: flex;
  align-items: center;
  padding: 10px;
}
</style>