import { defineStore } from 'pinia';
import { EMClient } from '@/EaseIM';
import { CHAT_TYPE } from '@/EaseIM/constant';
import { getEMKey } from '@/EaseIM/utils';

export const useConversationStore = defineStore('conversation', {
  state: () => {
    return {
      conversationList: [],
    };
  },
  getters: {
    //排序会话列表
    sortedConversationList() {
      return this.conversationList.sort((a, b) => {
        return b.time - a.time;
      });
    },
  },
  actions: {
    setConversationList(conversationList) {
      conversationList?.length &&
        conversationList.map((channel) => {
          const conversationBody = {
            channel_id: '',
            chatType: '',
            lastMessage: {},
            unread_num: 0,
            time: 0,
          };
          const { channel_id, unread_num, lastMessage } = channel;
          const { from, to, time } = lastMessage;
          const regexp = /.*@easemob.com$/;
          const chatType =
            (regexp.test(channel_id) && CHAT_TYPE.SINGLE_CHAT) ||
            CHAT_TYPE.GROUP_CHAT; //判断是单聊会话还是群组或聊天室会话
          console.log('chatType+++++++', chatType);
          conversationBody.channel_id = getEMKey(
            EMClient.user,
            from,
            to,
            chatType
          );
          conversationBody.chatType = chatType;
          conversationBody.lastMessage = channel.lastMessage;
          conversationBody.unread_num = unread_num;
          conversationBody.time = time;
          return this.conversationList.push(conversationBody);
        });
    },
    async deleteConversation(channel_id) {
      this.conversationList.length &&
        this.conversationList.forEach((channel, index) => {
          if (channel.channel_id === channel_id) {
            this.conversationList.splice(index, 1);
          }
        });
    },
    updateConversationLastMessage(channel_id, message) {
      const { time, from, to } = message;
      this.conversationList.forEach((channel) => {
        if (channel.channel_id === channel_id) {
          console.log('>>>>找到了要更新的会话', channel);
          if (from !== EMClient.user) {
            channel.unread_num = channel.unread_num + 1;
          }
          channel.time = time;
          channel.lastMessage = message;
          return;
        } else {
          console.log('>>>>没找到要更新的会话', channel);
        }
      });
    },
  },
});
