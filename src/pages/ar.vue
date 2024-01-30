<script setup lang="ts">
import 'aframe'
</script>

<template>
  <a-scene>
    <a-assets>
      <img id="boxTexture" src="https://i.imgur.com/mYmmbrp.jpg">
    </a-assets>
    <a-box src="#boxTexture" position="0 2 -5" rotation="0 45 45" scale="2 2 2"
      animation="property: object3D.position.y; to: 2.2; dir: alternate; dur: 2000; loop: true">
      <a-sphere position="1 0 3"></a-sphere>
    </a-box>
    <a-entity environment="preset: forest; dressingAmount: 500"></a-entity>
  </a-scene>
</template>