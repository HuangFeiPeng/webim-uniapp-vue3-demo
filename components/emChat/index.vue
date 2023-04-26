<template>
  <div>消息组件</div>
</template>

<script setup>
import { inject } from 'vue';
const injectTargetId = inject('targetId');
console.log('>>>>>', injectTargetId);
</script>

<style scoped>
@import './index.css';
</style>
