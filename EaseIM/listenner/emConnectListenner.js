import { EMClient } from '../index';
import { HANDLER_EVENT_NAME } from '../constant';
export const emConnectListenner = (callback, listennerEventName) => {
  console.log('>>>>连接监听已挂载');
  const connectListenFunc = {
    onConnected: () => {
      console.log('connected...');
      callback && callback('connected');
    },
    onDisconnected: () => {
      callback && callback('disconnected');
      console.log('disconnected...');
    },
  };
  EMClient.removeEventHandler(
    listennerEventName || HANDLER_EVENT_NAME.CONNECT_EVENT
  );
  EMClient.addEventHandler(
    listennerEventName || HANDLER_EVENT_NAME.CONNECT_EVENT,
    connectListenFunc
  );
};
