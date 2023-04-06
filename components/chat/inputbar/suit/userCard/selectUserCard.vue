<template>
  <uni-popup ref="selectUserCard" type="dialog">
    <uni-popup-dialog
      title="选择好友名片"
      placeholder="请输入内容"
      @confirm="confirmPicked"
      @close="cannelPick"
    >
      <scroll-view scroll-y="true" class="scroll-Y" @touchmove.stop>
        <uni-data-checkbox
          v-model="selectUserCardState.value"
          :localdata="selectUserCardState.friendList"
          :wrap="true"
        ></uni-data-checkbox>
      </scroll-view>
    </uni-popup-dialog>
  </uni-popup>
</template>

<script setup>
import { ref, reactive, watch, onMounted, toRefs } from 'vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
const props = defineProps({
  showModal: {
    type: Boolean,
    default: false,
  },
});
const $emits = defineEmits(['sendUserCardMessage', 'changeShowModal']);
const { showModal } = toRefs(props);
const selectUserCardState = reactive({
  showSelectUserModal: false,
  friendList: [],
  value: '',
});
onMounted(() => {
  selectUserCardState.showSelectUserModal = showModal.value;
});
watch(showModal, (newVal) => {
  console.log('>>>>监听到showModal', newVal);
  if (newVal) {
    initFriendList();
  }
  selectUserCardState.showSelectUserModal = newVal;
  handleModal();
});
const selectUserCard = ref(null);
const handleModal = () => {
  if (selectUserCardState.showSelectUserModal) {
    selectUserCard.value.open();
  } else {
    selectUserCard.value.close();
  }
};
const initFriendList = () => {
  const friendUserInfos = getApp().globalData.friendUserInfoMap;
  const membersList = uni.getStorageSync('member');
  let friendList = [];
  membersList.length &&
    membersList.map((item) => {
      const member = {
        text: '',
        value: '',
      };
      item.name && (member.value = item.name);
      if (
        friendUserInfos.has(item.name) &&
        friendUserInfos.get(item.name).nickname
      ) {
        member.text = friendUserInfos.get(item.name).nickname;
      } else {
        member.text = item.name;
      }
      console.log('member', member);
      return friendList.push(member);
    });
  selectUserCardState.friendList = friendList;
  console.log('friendList', friendList);
};

const confirmPicked = () => {
  const callback = () => {
    selectUserCardState.value = '';
  };
  $emits('sendUserCardMessage', selectUserCardState.value, callback);
};
const cannelPick = () => {
  selectUserCardState.showSelectUserModal = false;
  $emits('changeShowModal');
};
// export default {
//   props: {

//   },
//   data() {
//     return {

//     };
//   },
//   watch: {
//     showModal(newVal, oldVal) {
//
//     },
//   },
//   methods: {

//   },
// };
</script>
<style lang="scss" scoped>
// .slot-content {
//   font-size: 28rpx;
//   color: $u-content-color;
//   padding-left: 30rpx;
// }
// /deep/ .u-mode-center-box {
//   padding: 0 50rpx;
// }
:deep(.checklist-box) {
  width: 100%;
}
.scroll-Y {
  height: 300rpx;
}
</style>
