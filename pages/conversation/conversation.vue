<template>
  <view>
    <view>
      <view class="search" v-if="conversationState.search_btn">
        <view @tap="openSearch">
          <icon type="search" size="12"></icon>
          <text>搜索</text>
        </view>
      </view>
    </view>

    <!-- <view class="chat_list_wraper" > -->
    <scroll-view
      scroll-y="true"
      :class="
        'chat_list_wraper ' +
        (conversationState.gotop
          ? conversationState.isIPX
            ? 'goTopX'
            : 'goTop'
          : 'goback')
      "
      :style="
        'padding-bottom: ' + (conversationState.isIPX ? '270rpx' : '226rpx')
      "
    >
      <view class="search_input" v-if="conversationState.search_chats">
        <view>
          <icon type="search" size="12"></icon>
          <input
            placeholder="搜索"
            placeholder-style="color:#9B9B9B;line-height:21px;font-size:15px;"
            auto-focus
            confirm-type="search"
            type="text"
            @confirm="onSearch"
            @input="onInput"
            v-model="conversationState.input_code"
          />
          <icon
            type="clear"
            size="12"
            @tap.stop="clearInput"
            v-if="conversationState.show_clear"
          ></icon>
        </view>
        <text @tap="cancel">取消</text>
      </view>
      <view
        v-for="(item, index) in conversationList"
        :key="index"
        class="chat_list"
        :data-item="item"
        @tap.stop="del_chat"
      >
        <swipe-delete>
          <!-- 通知模块 -->
          <view
            class="tap_mask"
            @tap.stop="into_inform"
            :data-item="item"
            v-if="item.chatType == 'INFORM'"
          >
            <view class="list_box">
              <view class="list_left">
                <view class="list_pic">
                  <view
                    v-if="conversationState.unReadTotalNotNum > 0"
                    class="em-unread-spot2"
                    >{{ conversationState.unReadTotalNotNum }}</view
                  >
                  <image
                    :class="
                      conversationState.unReadTotalNotNum > 0 ? 'haveSpot' : ''
                    "
                    src="../../static/images/inform.png"
                  ></image>
                </view>
                <view class="list_text">
                  <text class="list_user"> 系统通知 </text>
                  <text class="list_word" v-if="item.chatType == 'INFORM'"
                    >申请通知来自：{{ item.info.from }}</text
                  >
                </view>
              </view>
              <view class="list_right">
                <text :data-username="item.username">{{
                  handleTime(item)
                }}</text>
              </view>
            </view>
          </view>
          <view
            class="tap_mask"
            @tap.stop="into_chatRoom"
            :data-item="JSON.stringify(item)"
            v-else
          >
            <!-- 消息列表 -->
            <view class="list_box">
              <view class="list_left" :data-username="item.channel_id">
                <view class="list_pic">
                  <view class="em-msgNum">
                    {{ item.unread_num > 99 ? '99+' : item.unread_num }}</view
                  >

                  <image :src="showConversationAvatar(item)"></image>
                </view>
                <view class="list_text">
                  <text class="list_user">{{
                    showConversationName(item)
                  }}</text>
                  <text
                    class="list_word"
                    v-if="item.lastMessage.type == MESSAGE_TYPE.TEXT"
                    >{{ item.lastMessage.msg }}</text
                  >
                  <text
                    class="list_word"
                    v-if="item.lastMessage.type == MESSAGE_TYPE.IMAGE"
                    >[图片]</text
                  >
                  <text
                    class="list_word"
                    v-if="item.lastMessage.type == MESSAGE_TYPE.AUDIO"
                    >[语音]</text
                  >
                  <text
                    class="list_word"
                    v-if="item.lastMessage.type == MESSAGE_TYPE.FILE"
                    >[附件]</text
                  >
                  <text
                    class="list_word"
                    v-if="item.lastMessage.type == MESSAGE_TYPE.VIDEO"
                    >[视频]</text
                  >
                  <text
                    class="list_word"
                    v-if="item.lastMessage.type == MESSAGE_TYPE.CUSTOM"
                  >
                    <text v-if="item.customEvent === 'userCard'"
                      >[个人名片]</text
                    >
                  </text>
                </view>
              </view>
              <view class="list_right">
                <text :data-username="item.username">{{
                  handleTime(item)
                }}</text>
              </view>
            </view>
          </view>
        </swipe-delete>
      </view>
    </scroll-view>
    <view v-if="!conversationList.length" class="chat_noChat">
      <image class="ctbg" src="/static/images/ctbg.png"></image>
      暂无聊天消息
    </view>
    <!-- bug: margin-bottom 不生效 需要加一个空标签-->
    <view style="height: 1px"></view>

    <view
      class="mask"
      @tap="close_mask"
      v-if="conversationState.show_mask"
    ></view>
  </view>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app';
import swipeDelete from '@/components/swipedelete/swipedelete';
import { emConversation } from '@/EaseIM/imApis';
import { CHAT_TYPE, MESSAGE_TYPE } from '@/EaseIM/constant';
import { useConversationStore } from '@/stores/conversation';
import { useContactsStore } from '@/stores/contacts';
import { useGroupStore } from '@/stores/group';
import dateFormater from '@/utils/dateFormater';

let isfirstTime = true;
const conversationState = reactive({
  //       msgtype,
  search_btn: true,
  search_chats: false,
  show_mask: false,
  yourname: '',
  unReadSpotNum: 0,
  unReadNoticeNum: 0,
  messageNum: 0,
  unReadTotalNotNum: 0,
  conversationList: [],
  show_clear: false,
  member: '',
  isIPX: false,
  gotop: false,
  input_code: '',
  groupName: {},
  winSize: {},
  popButton: ['删除该聊天'],
  showPop: false,
  currentVal: '',
  pushConfigData: [],
  defaultAvatar: '/static/images/theme2x.png',
  defaultGroupAvatar: '/static/images/groupTheme.png',
});
/* 会话列表 */
const conversationStore = useConversationStore();
const { fetchConversationFromServer } = emConversation();
const fetchConversationList = async () => {
  const res = await fetchConversationFromServer();
  if (res?.data?.channel_infos) {
    conversationStore.setConversationList(
      Object.assign([], res.data.channel_infos)
    );
  }
};

const conversationList = computed(() => {
  return conversationStore.conversationList;
});
//会话列表name&头像展示处理
const groupStore = useGroupStore();
const contactsStore = useContactsStore();
//好友属性
const friendUserInfoMap = computed(() => {
  return contactsStore.friendUserInfoMap;
});
//会话列表头像
const showConversationAvatar = computed(() => {
  return (item) => {
    if (item.chatType === CHAT_TYPE.SINGLE_CHAT || item.chatType === 'chat') {
      if (
        friendUserInfoMap.value.has(item.channel_id) &&
        friendUserInfoMap.value.get(item.channel_id)?.avatarurl
      ) {
        return friendUserInfoMap.value.get(item.channel_id).avatarurl;
      } else {
        return conversationState.defaultAvatar;
      }
    } else if (
      item.chatType.toLowerCase() === 'groupchat' ||
      item.chatType === CHAT_TYPE.GROUP_CHAT
    ) {
      return conversationState.defaultGroupAvatar;
    }
  };
});
//会话列表名称
const showConversationName = computed(() => {
  return (item) => {
    if (item.chatType === CHAT_TYPE.SINGLE_CHAT || item.chatType === 'chat') {
      if (
        friendUserInfoMap.value.has(item.channel_id) &&
        friendUserInfoMap.value.get(item.channel_id)?.nickname
      ) {
        return friendUserInfoMap.value.get(item.channel_id).nickname;
      } else {
        return item.channel_id;
      }
    } else if (
      item.chatType === CHAT_TYPE.GROUP_CHAT ||
      item.chatType === 'groupchat'
    ) {
      return item.channel_id;
    }
  };
});
//时间展示
const handleTime = computed(() => {
  return (item) => {
    return dateFormater('MM/DD/HH:mm', item.time);
  };
});
const openSearch = () => {
  conversationState.search_btn = false;
  conversationState.search_chats = true;
  conversationState.gotop = true;
};
const onSearch = (val) => {
  let searchValue = val.detail.value;
  var myName = uni.getStorageSync('myUsername');
  let serchList = [];
  let conversationList = [];
  uni.getStorageInfo({
    success: function (res) {
      let storageKeys = res.keys;
      let chatKeys = [];
      let len = myName.length;
      storageKeys.forEach((item) => {
        if (item.slice(-len) == myName) {
          chatKeys.push(item);
        }
      });
      chatKeys.forEach((item, index) => {
        if (item.indexOf(searchValue) != -1) {
          serchList.push(item);
        }
      });
      let lastChatMsg = '';
      serchList.forEach((item, index) => {
        let chatMsgs = uni.getStorageSync(item) || [];
        if (chatMsgs.length) {
          lastChatMsg = chatMsgs[chatMsgs.length - 1];
          conversationList.push(lastChatMsg);
        }
      });
      conversationState.conversationList = conversationList;
    },
  });
};
const cancel = () => {
  getLocalConversationlist();
  conversationState.search_btn = true;
  conversationState.search_chats = false;
  conversationState.unReadSpotNum =
    getApp().globalData.unReadMessageNum > 99
      ? '99+'
      : getApp().globalData.unReadMessageNum;
  conversationState.gotop = false;
};
const clearInput = () => {
  conversationState.input_code = '';
  conversationState.show_clear = false;
};
const onInput = (e) => {
  let inputValue = e.detail.value;
  if (inputValue) {
    conversationState.show_clear = true;
  } else {
    conversationState.show_clear = false;
  }
};
const tab_contacts = () => {
  uni.redirectTo({
    url: '../main/main?myName=' + uni.getStorageSync('myUsername'),
  });
};
const close_mask = () => {
  conversationState.search_btn = true;
  conversationState.search_chats = false;
  conversationState.show_mask = false;
};
const tab_setting = () => {
  uni.redirectTo({
    url: '../setting/setting',
  });
};
const tab_notification = () => {
  uni.redirectTo({
    url: '../notification/notification',
  });
};
const into_chatRoom = (event) => {
  let detail = JSON.parse(event.currentTarget.dataset.item);
  if (
    detail.chatType == msgtype.chatType.GROUP_CHAT ||
    detail.chatType == msgtype.chatType.CHAT_ROOM ||
    detail.groupName
  ) {
    into_groupChatRoom(detail);
  } else {
    into_singleChatRoom(detail);
  }
};
// 单聊
const into_singleChatRoom = (detail) => {
  var myName = uni.getStorageSync('myUsername');
  var nameList = {
    myName: myName,
    your: detail.username,
  };
  const friendUserInfoMap = getApp().globalData.friendUserInfoMap;
  if (
    friendUserInfoMap.has(nameList.your) &&
    friendUserInfoMap.get(nameList.your)?.nickname
  ) {
    nameList.yourNickName = friendUserInfoMap.get(nameList.your).nickname;
  }
  uni.navigateTo({
    url:
      '../singleChatEntry/singleChatEntry?username=' + JSON.stringify(nameList),
  });
};
// 群聊 和 聊天室 （两个概念）
const into_groupChatRoom = (detail) => {
  var myName = uni.getStorageSync('myUsername');
  var nameList = {
    myName: myName,
    your: detail.groupName,
    groupId: detail.info.to,
  };
  uni.navigateTo({
    url:
      '../groupChatEntry/groupChatEntry?username=' + JSON.stringify(nameList),
  });
};
const into_inform = () => {
  uni.redirectTo({
    url: '../notification/notification',
  });
};

const removeAndRefresh = (event) => {
  let removeId = event.currentTarget.dataset.item.info.from;
  let ary = getApp().globalData.saveFriendList;
  let idx;
  if (ary.length > 0) {
    ary.forEach((v, k) => {
      if (v.from == removeId) {
        idx = k;
      }
    });
    getApp().globalData.saveFriendList.splice(idx, 1);
  }
  uni.removeStorageSync('INFORM');
};

const del_chat = (event) => {
  let detail = event.currentTarget.dataset.item;
  let nameList = {};
  // 删除当前选中群组聊天列表
  if (detail.chatType == 'groupchat' || detail.chatType == 'chatRoom') {
    nameList = {
      your: detail.info.to,
    };
    //删除当前选中通知列表
  } else if (detail.chatType === 'INFORM') {
    nameList = {
      your: 'INFORM',
    };
  }
  //删除当前选中好友聊天列表
  else {
    nameList = {
      your: detail.username,
    };
  }
  var myName = uni.getStorageSync('myUsername');
  var currentPage = getCurrentPages();

  uni.showModal({
    title: '确认删除？',
    confirmText: '删除',
    success: function (res) {
      if (res.confirm) {
        uni.removeStorageSync(nameList.your + myName);
        uni.removeStorageSync('rendered_' + nameList.your + myName);
        nameList.your === 'INFORM' && removeAndRefresh(event);
        // if (Object.keys(currentPage[0]).length>0) {
        //   currentPage[0].onShow();
        // }
        disp.fire('em.chat.session.remove');
        getLocalConversationlist();
      }
    },
    fail: function (err) {
      console.log('删除列表', err);
    },
  });
};
const removeLocalStorage = (yourname) => {
  var myName = uni.getStorageSync('myUsername');
  uni.removeStorageSync(yourname + myName);
  uni.removeStorageSync('rendered_' + yourname + myName);
};

/* 获取窗口尺寸 */
const getWindowSize = () => {
  uni.getSystemInfo({
    success: (res) => {
      conversationState.winSize = {
        witdh: res.windowWidth,
        height: res.windowHeight,
      };
    },
  });
};
const hidePop = () => {
  conversationState.showPop = false;
};
const pickerMenuChange = () => {
  del_chat(conversationState.currentVal);
};
onLoad(() => {
  fetchConversationList();
});
onShow(() => {
  uni.hideHomeButton && uni.hideHomeButton();
});
onUnload(() => {});
</script>
<style>
@import './conversation.css';
</style>
