<template>
  <div>
    <button @click="saveImage">保存图片</button>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'  // 引入 ElMessage
import { ref } from 'vue'

const saveImage = () => {
  // 模拟图片保存操作
  setTimeout(() => {
    // 保存操作完成后弹出消息提示
    ElMessage.success('图片已保存！')  // 使用 Element Plus 提示框

  }, 1000)
}
</script>
