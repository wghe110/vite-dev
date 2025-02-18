import { defineStore } from 'pinia';

const globalStore = defineStore('global', {
  state() {
    return {
      activePath: ''
    };
  },
});

export default globalStore;
