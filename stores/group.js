import { defineStore } from 'pinia';
export const useGroupStore = defineStore('group', {
  state: () => ({
    joinedGroupList: [],
  }),
  actions: {
    setJoinedGroupList(joinedGroupList) {
      this.joinedGroupList = Object.assign(
        this.joinedGroupList,
        joinedGroupList
      );
    },
  },
});
