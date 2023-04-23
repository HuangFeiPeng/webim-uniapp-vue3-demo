<template>
  <div>
    <template v-if="isActiveComps === 'conversation'">
      <Conversation />
    </template>
    <template v-if="isActiveComps === 'contacts'">
      <Contacts />
    </template>
    <template v-if="isActiveComps === 'chat'">
      <Me />
    </template>
    <Tabbar
      :tab-type="isActiveComps"
      @switchHomeComponent="switchHomeComponent"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
/* components */
import Tabbar from '@/layout/tabbar';
import Conversation from '@/pages/conversation/conversation.vue';
import Contacts from '@/pages/main/main.vue';
import Me from '@/pages/setting/setting.vue';
const isActiveComps = ref('conversation');
// import contacts from '@/pages/contacts/contacts.vue';
// import me from '@/pages/me/me.vue';
const switchHomeComponent = (type) => {
  console.log('>>>>>执行切换', type);
  isActiveComps.value = type;
};
</script>

<style></style>
