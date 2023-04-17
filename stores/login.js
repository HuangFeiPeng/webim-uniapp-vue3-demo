import { defineStore } from 'pinia';

export const useLoginStore = defineStore('login', {
  state: () => {
    return {
      count: 0,
    };
  },
  actions: {
    increament() {
      this.count++;
    },
  },
});
