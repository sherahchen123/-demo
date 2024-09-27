/*
 * @Author: chenxiaoxuan
 * @Date: 2023-05-08 10:46:57
 * @LastEditTime: 2023-05-17 17:40:30
 * @LastEditors: chenxiaoxuan
 * @Description:
 */
import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router/index.ts';
import 'amfe-flexible';
import { createPinia } from 'pinia';
import * as echarts from 'echarts'
// import VCharts from 'vue-echarts-v3/src/full.js';

//创建应用实例对象
const app = createApp(App);

app.config.globalProperties.$echarts = echarts
// app.component('VChart', VCharts)
app
  .use(router)
  .use(createPinia())
  .mount('#app');
