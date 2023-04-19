<template>
  <view :class="isIPX ? 'chatRoom_tab_X' : 'chatRoom_tab'">
    <view class="tableBar" @click="changeTab('conversation')">
      <view
        v-if="unReadSpotNum > 0 || unReadSpotNum == '99+'"
        :class="
          'em-unread-spot ' +
          (unReadSpotNum == '99+' ? 'em-unread-spot-litleFont' : '')
        "
        >{{ unReadSpotNum + unReadTotalNotNum }}</view
      >
      <image
        :class="unReadSpotNum > 0 || unReadSpotNum == '99+' ? 'haveSpot' : ''"
        :src="
          tabType === 'conversation'
            ? highlightConversationImg
            : conversationImg
        "
      ></image>
      <text :class="tabType === 'conversation' && 'activeText'">会话</text>
    </view>

    <view class="tableBar" @click="changeTab('contacts')">
      <image
        :src="tabType === 'contacts' ? highlightContactsImg : contactsImg"
      ></image>
      <text :class="tabType === 'contacts' && 'activeText'">联系人</text>
    </view>

    <view class="tableBar" @click="changeTab('me')">
      <image :src="tabType === 'me' ? highlightSettingImg : settingImg"></image>
      <text :class="tabType === 'me' && 'activeText'">我的</text>
    </view>
  </view>
</template>

<script setup>
import { ref, toRefs } from 'vue';
/* images */
const conversationImg = '/static/images/session2x.png';
const highlightConversationImg = '/static/images/sessionhighlight2x.png';
const contactsImg = '/static/images/comtacts2x.png';
const highlightContactsImg = '/static/images/comtactshighlight2x.png';
const settingImg = '/static/images/setting2x.png';
const highlightSettingImg = '/static/images/settinghighlight2x.png';
/* props */
const props = defineProps({
  tabType: {
    type: String,
    default: 'conversation',
    required: true,
  },
});
/* emits */
const emits = defineEmits(['switchHomeComponent']);
const { tabType } = toRefs(props);
console.log('tabType', tabType.value);
const isIPX = ref(false);
const unReadSpotNum = ref(0);
const unReadTotalNotNum = ref(0);

const changeTab = (type) => {
  console.log('tabbar', type);
  const myName = 'hfp';
  //   switch (type) {
  //     case 'conversation':
  //       {
  //         uni.redirectTo({
  //           url: '../conversation/conversation',
  //         });
  //       }
  //       break;
  //     case 'contacts':
  //       {
  //         uni.redirectTo({
  //           url: '../main/main?myName=' + myName,
  //         });
  //       }
  //       break;
  //     case 'me': {
  //       uni.redirectTo({
  //         url: '../setting/setting',
  //       });
  //     }
  //     default:
  //       break;
  //   }
  emits('switchHomeComponent', type);
};
</script>

<style scoped>
@import './index.css';
</style>
