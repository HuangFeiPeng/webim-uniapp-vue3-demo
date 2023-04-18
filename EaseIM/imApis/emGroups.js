import { EMClient } from '@/EaseIM';
const emGroups = () => {
  const fetchJoinedGroupListFromServer = () => {
    return new Promise((resolve, reject) => {
      console.log('>>>>开始获取加入的群组列表');
      EMClient.getGroup({
        limit: 100,
        success: function (res) {
          resolve(res.data);
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  };
  return {
    fetchJoinedGroupListFromServer,
  };
};

export default emGroups;
