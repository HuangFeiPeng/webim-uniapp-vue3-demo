import { defineStore } from 'pinia';

export const useLoginStore = defineStore('login', {
  state: () => {
    return {
      loginUserBaseInfos: {
        loginUserId: '',
        phoneNumber: '',
      },
    };
  },
  actions: {
    setLoginUserBaseInfos(baseInfos) {
      this.loginUserBaseInfos = Object.assign(
        this.loginUserBaseInfos,
        baseInfos
      );
    },
  },
});
