import HelloWorld from './HelloWorld.vue'

const customPlus = {
  install(Vue) {
    // 组件
    Vue.component('hello-world', HelloWorld);
  },
};

export default customPlus;
