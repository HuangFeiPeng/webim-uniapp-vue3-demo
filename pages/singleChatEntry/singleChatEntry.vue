<template>
  <chat
    id="chat"
    :username="username"
    ref="chatComp"
    chatType="singleChat"
  ></chat>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onUnload, onPullDownRefresh } from '@dcloudio/uni-app';
import disp from '@/utils/broadcast';
// let disp = require('../../utils/broadcast');
import chat from '@/components/chat/chat.vue';
const username = ref('');
const chatComp = ref(null);

const onNavigationBarButtonTap = () => {
  uni.navigateTo({
    url: `/pages/moreMenu/moreMenu?username=${username.value.your}&type=singleChat`,
  });
};
onLoad((options) => {
  let username = JSON.parse(options.username);
  username.value = options.username;
  // 生成的支付宝小程序在onLoad里获取不到，这里放到全局变量下
  uni.username = username;
  uni.setNavigationBarTitle({
    title: username?.yourNickName || username?.your,
  });
});
onPullDownRefresh(() => {
  uni.showNavigationBarLoading();
  chatComp.value.getMore();
  // 停止下拉动作
  uni.hideNavigationBarLoading();
  uni.stopPullDownRefresh();
});

onUnload(() => {
  disp.fire('em.chatroom.leave');
});
</script>
<style>
@import './singleChatEntry.css';
</style>
