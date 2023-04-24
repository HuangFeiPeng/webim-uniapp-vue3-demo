<template>
  <div>
    <template v-if="isActiveComps === 'conversation'">
      <Conversation />
    </template>
    <template v-if="isActiveComps === 'contacts'">
      <Contacts />
    </template>
    <template v-if="isActiveComps === 'me'">
      <!-- <Me /> -->
    </template>
    <Tabbar
      :tab-type="isActiveComps"
      @switchHomeComponent="switchHomeComponent"
    />
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
/* components */
import Tabbar from '@/layout/tabbar';
import Conversation from '@/pages/conversation/conversation.vue';
import Contacts from '@/pages/contacts/contacts.vue';
// import Me from '@/pages/setting/setting.vue';
const isActiveComps = ref('conversation');
const switchHomeComponent = (type) => {
  console.log('>>>>>执行切换', type);
  isActiveComps.value = type;
};
/* 设置当前标题 */
const titleMap = {
  conversation: '会话列表',
  contacts: '联系人',
  me: '我的',
};
watchEffect(() => {
  uni.setNavigationBarTitle({
    title: titleMap[isActiveComps.value],
  });
});
</script>

<style></style>
