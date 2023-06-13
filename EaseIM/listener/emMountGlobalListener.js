import { emContactsListener } from './emContactsListener';
import { emGroupListener } from './emGroupListener';
import { emMessagesListener } from './emMessagesListener';
import { emErrorListener } from './emErrorListener';
export const emMountGlobalListener = () => {
  console.log('>>>>全局监听');
  emMessagesListener();
  emContactsListener();
  emGroupListener();
  emErrorListener();
};
