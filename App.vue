<script>
import disp from '@/utils/broadcast';
// import { onGetSilentConfig } from './components/chat/pushStorage';
/* EaseIM */
import '@/EaseIM';
import { emConnectListenner, emMountGlobalListenner } from '@/EaseIM/listenner';
import { emUserInfos, emGroups, emContacts } from '@/EaseIM/imApis';
import { CONNECT_CALLBACK_TYPE } from '@/EaseIM/constant';
import { useLoginStore } from '@/stores/login';
import { useGroupStore } from '@/stores/group';
import { useContactsStore } from '@/stores/contacts';
import { EMClient } from './EaseIM';
// let logout = false;
// function ack(receiveMsg) {
//   // 处理未读消息回执
//   var bodyId = receiveMsg.id; // 需要发送已读回执的消息id

//   var ackMsg = new WebIM.message('read', WebIM.conn.getUniqueId());
//   ackMsg.set({
//     id: bodyId,
//     to: receiveMsg.from,
//   });
//   WebIM.conn.send(ackMsg.body);
// }

// function onMessageError(err) {
//   if (err.type === 'error') {
//     uni.showToast({
//       title: err.errorText,
//     });
//     return false;
//   }

//   return true;
// }

// 包含陌生人版本
//该方法用以计算本地存储消息的未读总数。
function calcUnReadSpot(message) {
  let myName = uni.getStorageSync('myUsername');
  let pushObj = uni.getStorageSync('pushStorageData');
  let pushAry = pushObj[myName] || [];
  uni.getStorageInfo({
    success: function (res) {
      let storageKeys = res.keys;
      let newChatMsgKeys = [];
      let historyChatMsgKeys = [];
      storageKeys.forEach((item) => {
        if (item.indexOf(myName) > -1 && item.indexOf('rendered_') == -1) {
          newChatMsgKeys.push(item);
        }
      });
      let count = newChatMsgKeys.reduce(function (result, curMember, idx) {
        let newName = curMember.split(myName)[0];
        let chatMsgs;
        chatMsgs = uni.getStorageSync(curMember) || [];
        //过滤消息来源与当前登录ID一致的消息，不计入总数中。
        chatMsgs = chatMsgs.filter((msg) => msg.yourname !== myName);
        if (pushAry.includes(newName)) return result;
        return result + chatMsgs.length;
      }, 0);
      getApp().globalData.unReadMessageNum = count;
      disp.fire('em.unreadspot', message);
    },
  });
}

// function saveGroups() {
//   var me = this;
//   return WebIM.conn.getGroup({
//     limit: 50,
//     success: function (res) {
//       uni.setStorage({
//         key: 'listGroup',
//         data: res.data,
//       });
//     },
//     error: function (err) {
//       console.log(err);
//     },
//   });
// }

export default {
  globalData: {
    // phoneNumber: '',
    // unReadMessageNum: 0,
    // userInfo: null,
    // userInfoFromServer: null, //用户属性从环信服务器获取
    // friendUserInfoMap: new Map(), //好友属性
    // saveFriendList: [],
    saveGroupInvitedList: [],
    isIPX: false, //是否为iphone X
    // conn: {
    //   closed: false,
    //   curOpenOpt: {},

    //   open(opt) {
    //     uni.showLoading({
    //       title: '正在初始化客户端..',
    //       mask: true,
    //     });
    //     const actionOpen = () => {
    //       this.curOpenOpt = opt;
    //       WebIM.conn
    //         .open(opt)
    //         .then(() => {
    //           //token获取成功，即可开始请求用户属性。
    //           disp.fire('em.mian.profile.update');
    //           disp.fire('em.mian.friendProfile.update');
    //           disp.fire('em.init.friendList');
    //         })
    //         .catch((err) => {
    //           console.log('>>>>>token获取失败', err);
    //         });
    //       this.closed = false;
    //     };
    //     if (WebIM.conn.isOpened()) {
    //       WebIM.conn.close();
    //       setTimeout(() => {
    //         actionOpen();
    //       }, 300);
    //     } else {
    //       actionOpen();
    //     }
    //   },
    //   reopen() {
    //     if (this.closed) {
    //       //this.open(this.curOpenOpt);
    //       WebIM.conn.open(this.curOpenOpt);
    //       this.closed = false;
    //     }
    //   },
    // },
    // getUserInfo(cb) {
    //   var me = this;
    //   if (this.userInfo) {
    //     typeof cb == 'function' && cb(this.userInfo);
    //   } else {
    //     // 调用登录接口
    //     uni.login({
    //       success() {
    //         uni.getUserInfo({
    //           success(res) {
    //             me.userInfo = res.userInfo;
    //             typeof cb == 'function' && cb(me.userInfo);
    //           },
    //         });
    //       },
    //     });
    //   }
    // },
    // checkIsIPhoneX: function () {
    //   const me = this;
    //   uni.getSystemInfo({
    //     success: function (res) {
    //       // 根据 model 进行判断
    //       if (res.model && res.model.search('iPhone X') != -1) {
    //         me.isIPX = true;
    //       }
    //     },
    //   });
    // },
  },

  setup() {
    const loginStore = useLoginStore();
    const groupStore = useGroupStore();
    const contactsStore = useContactsStore();
    /* 链接所需监听回调 */
    //传给监听callback回调
    const connectedCallback = (type) => {
      console.log('>>>>>连接成功回调', type);
      if (type === CONNECT_CALLBACK_TYPE.CONNECT_CALLBACK) {
        onConnectedSuccess();
      }
      if (type === CONNECT_CALLBACK_TYPE.DISCONNECT_CALLBACK) {
        onDisconnect();
      }
      if (type === CONNECT_CALLBACK_TYPE.RECONNECTING_CALLBACK) {
        onReconnecting();
      }
    };
    //IM连接成功
    const onConnectedSuccess = () => {
      const myName = 'hfp';
      if (!loginStore.loginStatus) {
        fetchLoginUserNeedData();
      }
      loginStore.setLoginStatus(true);
      uni.hideLoading();
      uni.redirectTo({
        url: '../home/index?myName=' + myName,
      });
    };
    //IM断开连接
    const onDisconnect = () => {
      console.log('>>>>处理断开连接监听');
      if (!loginStore.status) {
        uni.showToast({
          title: '退出登录',
          icon: 'none',
          duration: 2000,
        });
        uni.redirectTo({
          url: '../login/login',
        });
        EMClient.close();
      }
    };
    //IM重连中
    const onReconnecting = () => {
      uni.showToast({
        title: '重连中...',
        duration: 2000,
      });
    };
    //挂载IM websocket连接成功监听
    emConnectListenner(connectedCallback);
    const { fetchUserInfoWithLoginId, fetchOtherInfoFromServer } =
      emUserInfos();
    const { fetchJoinedGroupListFromServer } = emGroups();
    const { fetchContactsListFromServer } = emContacts();
    //获取登录所需基础参数
    const fetchLoginUserNeedData = async () => {
      //获取好友列表
      const friendList = await fetchContactsListFromServer();
      await contactsStore.setFriendList(friendList);
      //获取群组列表
      const joinedGroupList = await fetchJoinedGroupListFromServer();
      console.log('>>>>>>>拿到加入的群组列表', joinedGroupList);
      joinedGroupList.length &&
        (await groupStore.setJoinedGroupList(joinedGroupList));
      if (friendList.length) {
        //获取好友用户属性
        const friendProfiles = await fetchOtherInfoFromServer(friendList);
        console.log('friendProfiles', friendProfiles);
        contactsStore.setFriendUserInfotoMap(friendProfiles);
      }
      //获取当前登录用户好友信息
      const profiles = await fetchUserInfoWithLoginId();
      await loginStore.setLoginUserProfiles(profiles[EMClient.user]);
    };
    //挂载全局所需监听回调【好友关系、消息监听、群组监听】
    emMountGlobalListenner();
  },
};
</script>
<style lang="scss">
@import './app.css';
</style>
