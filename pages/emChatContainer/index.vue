<template>
  <div>
    <em-chat :id="props.id" :chatType="props.chatType" />
  </div>
</template>

<script setup>
import { toRefs, reactive, provide, readonly, computed } from 'vue';
import EmChat from '@/components/emChat';
import { onLoad, onUnload, onNavigationBarButtonTap } from '@dcloudio/uni-app';
const props = defineProps({
  targetId: {
    type: String,
    value: '',
    required: true,
  },
  chatType: {
    type: String,
    value: '',
    required: true,
  },
});

const { targetId, chatType } = toRefs(reactive(props));
console.log(targetId, chatType);
provide('targetId', readonly(targetId));
provide('chatType', readonly(chatType));

uni.setNavigationBarTitle({
  title: targetId.value,
});
</script>

<style scoped>
@import './index.css';
</style>
