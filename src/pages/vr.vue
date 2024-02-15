<script setup lang="ts">
import 'aframe'
</script>

<template>
  <a-scene v-pre>
    <a-sky src="url(/assets/exhibition/sky.webp)"></a-sky>
    <a-entity gltf-model="url(/assets/exhibition/jar.glb)" position="0 -3 -5" rotation="-90 0 0" scale="0.05 0.05 0.05"></a-entity>
    <a-entity gltf-model="url(/assets/exhibition/claw.glb)" position="-5 0 0" rotation="0 0 0" scale="1 1 1"></a-entity>
    <a-entity gltf-model="url(/assets/exhibition/conch.glb)" position="0 0 5" rotation="0 0 0" scale="0.05 0.05 0.05"></a-entity>
    <a-entity gltf-model="url(/assets/exhibition/fossil.glb)" position="5 0 0" rotation="0 -90 0" scale="0.5 0.5 0.5"></a-entity>
  </a-scene>
</template>