<script>
/* EaseIM */
import '@/EaseIM';
import { emConnectListener, emMountGlobalListener } from '@/EaseIM/listener';
import { emUserInfos, emGroups, emContacts } from '@/EaseIM/imApis';
import { CONNECT_CALLBACK_TYPE } from '@/EaseIM/constant';
import { useLoginStore } from '@/stores/login';
import { useGroupStore } from '@/stores/group';
import { useContactsStore } from '@/stores/contacts';
import { EMClient } from './EaseIM';

export default {
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
      console.log('>>>>处理断开连接监听', loginStore.loginStatus);
      if (!loginStore.loginStatus) {
        uni.showToast({
          title: '退出登录',
          icon: 'none',
          duration: 2000,
        });
        uni.redirectTo({
          url: '../login/login',
        });
        EMClient.close();
      } else {
        console.log('>>>>执行重新补登录');
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
    emConnectListener(connectedCallback);
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
    emMountGlobalListener();
  },
};
</script>
<style lang="scss">
@import './app.css';
</style>
