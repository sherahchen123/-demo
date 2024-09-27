/*
 * @Author: chenxiaoxuan
 * @Date: 2023-05-08 17:01:19
 * @LastEditTime: 2023-05-08 17:02:53
 * @LastEditors: chenxiaoxuan
 * @Description:
 */
// store/index.ts
import { defineStore } from 'pinia';
// defineStore(key,options) 必须传递一个唯一key作为标识
export const useCounterStore = defineStore('counterStore', {
  state: () => ({
    counter: 0
  }),
  actions: {
    // 方法 可以是异步 async addCounter(){}
    // 在这里也可以访问其他的store
    addCounter() {
      this.counter++;
    }
  },
  getters: {
    doubleCounter(state): number {
      // 可以使用this
      // return this.counter * 2
      // 在这里也可以访问其他的store
      return state.counter * 2;
    }
  }
});
