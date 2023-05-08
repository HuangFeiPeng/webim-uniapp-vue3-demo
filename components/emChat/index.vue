<template>
  <view>
    <message-list />
    <input-bar />
  </view>
</template>

<script setup>
import { inject } from 'vue';
/* component */
import MessageList from './messageList';
import InputBar from './inputBar';
const injectTargetId = inject('targetId');
console.log('>>>>>', injectTargetId);
</script>

<style scoped>
@import './index.css';
</style>
