<template>
  <form class="text-input">
    <view class="f-row">
      <!-- 发送语音 -->
      <view>
        <image class="icon-mic" src="/static/images/voice.png"></image>
      </view>
      <!-- 输入框 -->
      <textarea
        class="f news"
        type="text"
        cursor-spacing="65"
        confirm-type="send"
        v-model.trim="inputContent"
        @confirm="sendTextMessage"
        :confirm-hold="true"
        auto-height
        :show-confirm-bar="false"
        maxlength="300"
      />
      <view>
        <image class="icon-mic" src="/static/images/Emoji.png"></image>
      </view>
      <view v-show="!inputContent">
        <image class="icon-mic" src="/static/images/ad.png"></image>
      </view>
      <button
        class="send-btn-style"
        hover-class="hover"
        @tap="sendTextMessage"
        v-show="inputContent"
      >
        发送
      </button>
    </view>
  </form>
</template>

<script setup>
import { ref } from 'vue';
const inputContent = ref('');
const sendTextMessage = () => {
  console.log('>>>>>调用发送文本消息', inputContent.value);
};
</script>
<style>
@import './index.css';
</style>
