import { EMClient } from '../index';
const emConversation = () => {
  const fetchConversationFromServer = () => {
    return new Promise((resolve, reject) => {
      //支持分页这里写死只取二十条
      EMClient.getConversationlist({ pageNum: 1, pageSize: 20 })
        .then((res) => {
          console.log('>>>>会话列表数据获取成功');
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  return { fetchConversationFromServer };
};

export default emConversation;
