<template>
  <view class="input_bar_container">
    <input-audio ref="inputAudioComp" />
    <input-main @toggleRecordModal="toggleRecordModal" />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import InputAudio from './suit/audio';
import InputMain from './suit/main';

const inputAudioComp = ref(null);
const toggleRecordModal = () => {
  inputAudioComp.value.toggleRecordModal();
};
</script>

<style scoped>
@import './index.css';
</style>
