<template>
  <view class="input_bar_container">
    <input-audio ref="inputAudioComp" />
    <input-main
      ref="inputMainComp"
      @toggleRecordModal="toggleRecordModal"
      @openEmojiModal="openEmojiModal"
      @closeEmojiModal="closeEmojiModal"
    />
    <input-emoji
      ref="inputEmojiComp"
      @appendEmojiMapString="appendEmojiMapString"
      @deleteEmojiMapString="deleteEmojiMapString"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import InputAudio from './suit/audio';
import InputMain from './suit/main';
import InputEmoji from './suit/emoji';
//核心文本输入相关
const inputMainComp = ref(null);

//语音录制相关
const inputAudioComp = ref(null);
const toggleRecordModal = () => {
  inputAudioComp.value.toggleRecordModal();
};
//emoji输入相关
const inputEmojiComp = ref(null);
const openEmojiModal = () => {
  inputEmojiComp.value.openEmoji();
};
const closeEmojiModal = () => {
  inputEmojiComp.value.cancelEmoji();
};
const appendEmojiMapString = (emoji) => {
  if (!emoji) return;
  inputMainComp.value.inputContent = inputMainComp.value.inputContent + emoji;
};
const deleteEmojiMapString = () => {
  inputMainComp.value.delEmojiMapString();
};
</script>

<style scoped>
@import './index.css';
</style>
