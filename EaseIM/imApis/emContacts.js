import { EMClient } from '../index';
const emContacts = () => {
  const fetchContactsListFromServer = () => {
    return new Promise((resolve, reject) => {
      EMClient.getContacts()
        .then((res) => {
          const { data } = res;
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const removeContactFromServer = (contactId) => {
    if (contactId) {
      EMClient.deleteContact(contactId);
    }
  };
  return {
    fetchContactsListFromServer,
    removeContactFromServer,
  };
};
export default emContacts;
