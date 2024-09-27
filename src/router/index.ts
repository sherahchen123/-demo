/*
 * @Author: chenxiaoxuan
 * @Date: 2023-05-08 10:58:23
 * @LastEditTime: 2023-05-08 17:00:32
 * @LastEditors: chenxiaoxuan
 * @Description:
 */
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
  },
  {
    path: "/next",
    name: "next",
    meta: {
      navTitle: "next",
      weight: 1 // 权重
    },
    component: () => import("@/views/next/next.vue")
  },
  {
    path: "/cesiumPage",
    name: "cesiumPage",
    meta: {
      navTitle: "cesiumPage",
      weight: 1 // 权重
    },
    component: () => import("@/views/cesiumPage/cesiumPage.vue")
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
