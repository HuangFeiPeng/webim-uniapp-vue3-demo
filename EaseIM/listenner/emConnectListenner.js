import { EMClient } from '../index';
import { HANDLER_EVENT_NAME } from '../constant';
export const emConnectListenner = () => {
  console.log('>>>>连接监听已挂载');
  const connectListenFunc = {
    onConnected: () => {
      console.log('connected...');
    },
    onDisconnected: () => {
      console.log('disconnected...');
    },
  };
  EMClient.removeEventHandler(HANDLER_EVENT_NAME.CONNECT_EVENT);
  EMClient.addEventHandler(HANDLER_EVENT_NAME.CONNECT_EVENT, connectListenFunc);
};
