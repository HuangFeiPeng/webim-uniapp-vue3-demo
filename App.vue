<script>
/* EaseIM */
import '@/EaseIM';
import { emConnectListener, emMountGlobalListener } from '@/EaseIM/listener';
import { emConnect, emUserInfos, emGroups, emContacts } from '@/EaseIM/imApis';
import emHandleReconnect from '@/EaseIM/utils/emHandleReconnect';
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
    const { closeEaseIM } = emConnect();
    const onConnectedSuccess = () => {
      const { loginUserId } = loginStore.loginUserBaseInfos || {};
      const finalLoginUserId = loginUserId || EMClient.user;
      if (!loginStore.loginStatus) {
        fetchLoginUserNeedData();
      }
      loginStore.setLoginUserBaseInfos({ loginUserId: finalLoginUserId });
      loginStore.setLoginStatus(true);
      uni.hideLoading();
      uni.redirectTo({
        url: '../home/index?myName=' + finalLoginUserId,
      });
    };
    //IM断开连接
    const { actionEMReconnect } = emHandleReconnect();
    const onDisconnect = () => {
      //断开回调触发后，如果业务登录状态为true则说明异常断开需要重新登录
      if (!loginStore.loginStatus) {
        uni.showToast({
          title: '退出登录',
          icon: 'none',
          duration: 2000,
        });
        uni.redirectTo({
          url: '../login/login',
        });
        closeEaseIM();
      } else {
        //执行通过token进行重新登录
        actionEMReconnect();
      }
    };
    //IM重连中
    const onReconnecting = () => {
      uni.showToast({
        title: 'IM 重连中...',
        icon: 'none',
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
      joinedGroupList.length &&
        (await groupStore.setJoinedGroupList(joinedGroupList));
      if (friendList.length) {
        //获取好友用户属性
        const friendProfiles = await fetchOtherInfoFromServer(friendList);
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
