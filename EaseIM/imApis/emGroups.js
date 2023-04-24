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
  const createNewGroup = (params) => {
    return new Promise((resolve, reject) => {
      console.log('>>>>开始创建群组');
      EMClient.createGroup({ data: { ...params } })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  return {
    fetchJoinedGroupListFromServer,
    createNewGroup,
  };
};

export default emGroups;
