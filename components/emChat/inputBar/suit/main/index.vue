<template>
  <form class="text-input">
    <view class="f-row">
      <!-- 发送语音 -->
      <view @click="emits('toggleRecordModal')">
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
import { ref, inject } from 'vue';
import { emMessages } from '@/EaseIM/imApis';
/* emits */
const emits = defineEmits(['toggleRecordModal']);
const inputContent = ref('');
//发送文本消息
const { sendDisplayMessages } = emMessages();
const injectTargetId = inject('targetId');
const injeactChatType = inject('chatType');
const sendTextMessage = async () => {
  const params = {
    // 消息类型。
    type: 'txt',
    // 消息内容。
    msg: inputContent.value,
    // 消息接收方：单聊为对方用户 ID，群聊和聊天室分别为群组 ID 和聊天室 ID。
    to: injectTargetId.value,
    // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
    chatType: injeactChatType.value,
  };
  try {
    const res = await sendDisplayMessages({ ...params });
    console.log('>>>>>文本消息发送成功', res);
  } catch (error) {
    console.log('>>>>>文本消息发送失败', error);
    uni.showToast({
      title: '消息发送失败',
      icon: 'none',
    });
  } finally {
    inputContent.value = '';
  }
};
</script>
<style>
@import './index.css';
</style>
