<script setup lang="ts">
import 'aframe'
</script>

<template>
  <a-scene v-pre>
    <a-assets>
      <!-- <a-asset-item id="claw" src="/models/claw.glb"></a-asset-item>
      <a-asset-item id="conch" src="/models/conch.glb"></a-asset-item>
      <a-asset-item id="fossil" src="/models/fossil.glb"></a-asset-item>
      <a-asset-item id="jar" src="/models/jar.glb"></a-asset-item> -->
    </a-assets>
    <a-entity gltf-model="url(/models/jar.glb)" position="0 -3 -5" rotation="-90 0 0" scale="0.05 0.05 0.05"></a-entity>
  </a-scene>
</template>