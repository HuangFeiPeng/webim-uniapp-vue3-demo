import { defineStore } from 'pinia';

export const useMessageStore = defineStore('message', {
  state: () => {
    return {
      messageCollection: {},
    };
  },
  actions: {
    updateMessageCollection(key, message) {
      console.log('>>>>>开始插入消息', key, message);
      if (this.messageCollection[key]) {
        this.messageCollection[key].push(message);
      } else {
        this.messageCollection[key] = [];
        this.messageCollection[key].push(message);
      }
    },
    fetchHistoryPushToMsgCollection(key, messageData) {
      if (this.messageCollection[key]) {
        this.messageCollection[key].unshift(...messageData);
      } else {
        this.messageCollection[key] = [];
        this.messageCollection[key].push(...messageData);
      }
    },
  },
});
