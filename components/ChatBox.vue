<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps<{
  defaultText: string
}>()
const text = ref(props.defaultText)
const question = ref('')


</script>

<template>
  <div v-bind="$attrs">
    <div class="upper">
      <input v-model="question" />
      <button>提问</button>
    </div>
    <div>{{ text }}</div>
  </div>
</template>

<style scoped>
.upper {
  display: flex;
  justify-content: space-between;
}

button {
  font-size: 0.8rem;
}

input {
  flex-grow: 1;
  display: block;
  box-sizing: border-box;
  outline: none;
  padding: 4px;
  border: 1px solid #bdbdbd;
}

input:hover,
input:focus {
  border-color: #757575;
}
</style>