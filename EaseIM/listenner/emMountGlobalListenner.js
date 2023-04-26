import { emContactsListenner } from './emContactsListenner';
import { emGroupListenner } from './emGroupListenner';
import { emMessagesListenner } from './emMessagesListenner';
export const emMountGlobalListenner = () => {
  console.log('>>>>全局监听');
  emMessagesListenner();
  emContactsListenner();
  emGroupListenner();
};
