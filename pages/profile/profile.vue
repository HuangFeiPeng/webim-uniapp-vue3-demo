<template>
  <view v-if="profileState.otherProfile">
    <view class="head_pic">
      <text>头像</text>
      <image
        :src="
          profileState.otherProfile.avatarurl ||
          profileState.otherProfile.avatar ||
          profileState.defaultAvatar
        "
      ></image>
    </view>
    <view class="head_pic">
      <text>id</text>
      <text>{{ profileState.otherProfile.uid || '' }}</text>
    </view>
    <view class="head_pic">
      <text>昵称</text>
      <text>{{ profileState.otherProfile.nickname || '暂无昵称' }}</text>
    </view>
  </view>
  <view v-else>
    <view class="head_pic" @click="to_select_avatar">
      <text>头像</text>
      <image :src="loginUserAvactar"></image>
    </view>
    <view class="head_pic" @click="showChangeNickNameModal">
      <text>昵称</text>
      <text>{{ profileForm.nickname || '' }}</text>
    </view>
    <uni-popup ref="changeNicknameModal" type="dialog">
      <uni-popup-dialog
        title="更改昵称"
        @confirm="saveNickname"
        @close="hideChangeNickNameModal"
      >
        <input
          class="uni-input"
          :maxlength="15"
          v-model="profileForm.nickname"
          focus
          placeholder="请输入您的昵称"
        />
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>
<script setup>
import { reactive, ref, computed } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import disp from '@/utils/broadcast';
const WebIM = uni.WebIM;
const profileState = reactive({
  isShowEditModal: false,
  nickname: '',
  loginUserInfos: null,
  defaultAvatar: '/static/images/theme2x.png',
  otherProfile: null,
});
let profileForm = reactive({
  nickname: '',
  avatarurl: '',
  mail: '',
  phone: '',
  gender: '',
  birth: '',
  sign: '',
});
onLoad((options) => {
  if (options.otherProfile) {
    uni.setNavigationBarTitle({
      title: '个人名片',
    });
    profileState.otherProfile = JSON.parse(options.otherProfile);
  } else {
    profileState.loginUserInfos = getApp().globalData.userInfoFromServer;
  }
});
onShow(() => {
  const loginUserInfos = getApp().globalData.userInfoFromServer;
  profileForm = Object.assign(profileForm, loginUserInfos);
});
const loginUserAvactar = computed(() => {
  return profileState.loginUserInfos?.avatarurl || profileState.defaultAvatar;
});
const to_select_avatar = () => {
  uni.navigateTo({
    url: '../profile/selectAvatar',
  });
};
const changeNicknameModal = ref(null);
const showChangeNickNameModal = () => {
  changeNicknameModal.value.open();
};
const hideChangeNickNameModal = () => {
  changeNicknameModal.value.close();
};
//保存更改的用户昵称
const saveNickname = async (e) => {
  if (!profileForm.nickname) return;
  try {
    await WebIM.conn.updateUserInfo('nickname', profileForm.nickname);
    disp.fire('em.mian.profile.update');
    uni.showToast({ title: '更新成功', icon: 'none' });
    hideChangeNickNameModal();
  } catch (error) {
    uni.showToast({
      title: '保存失败',
      icon: 'none',
      duration: 2000,
    });
  }
};
</script>
<style>
@import './profile.css';
</style>
