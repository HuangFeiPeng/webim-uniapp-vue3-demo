import { emContactsListenner } from './emContactsListenner';
import { emGroupListenner } from './emGroupListenner';
export const emMountGlobalListenner = () => {
  console.log('>>>>全局监听');
  emContactsListenner();
  emGroupListenner();
};
