<!--
 * @Author: chenxiaoxuan
 * @Date: 2023-05-08 14:04:45
 * @LastEditTime: 2023-05-08 17:33:08
 * @LastEditors: chenxiaoxuan
 * @Description: 
-->
<template>
  <div>
    next
    <div id="map"></div>
    <van-button @click="goBack">toMain</van-button>
    <van-button @click="addCounter">counter++++</van-button>
    <van-button @click="replaceStore">替换state状态值</van-button>
    <van-button @click="testAxios">调用测试接口</van-button>
  </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useCounterStore } from "@/store/index";
import { getTest } from "@/api/index";
// import { Graph } from "@antv/x6";
// import L7 from "@antv/l7";
import { onMounted } from "vue";
const router = useRouter();
onMounted(() => {
  // addGraph();
  // addL7Scene();
});
function goBack() {
  router.push({ path: "/" });
}
// function addL7Scene() {
//   const scene = new L7.Scene({
//     id: "map",
//     map: new L7.Map({
//       center: [110.770672, 34.159869],
//       zoom: 4,
//     }),
//   });

//   const url1 =
//     "https://t0.tianditu.gov.cn/img_w/wmts?tk=b72aa81ac2b3cae941d1eb213499e15e&";
//   const layer1 = new L7.RasterLayer({
//     zIndex: 1,
//   }).source(url1, {
//     parser: {
//       type: "rasterTile",
//       tileSize: 256,
//       wmtsOptions: {
//         layer: "img",
//         tileMatrixset: "w",
//         format: "tiles",
//       },
//     },
//   });

//   scene.on("loaded", () => {
//     scene.addLayer(layer1);
//   });
// }
// function addGraph() {
//   const graph: any = new Graph({
//     panning: true, //支持平移
//     selecting: {
//       enabled: true, //支持选中
//       multiple: true,
//       movable: true, //支持拖动
//     },
//   });
//   graph.zoom(0.2); //在原来缩放级别上增加0.2
//   graph.zoom(-0.2); //在原来缩放级别上减少0.2
// }
const counterStore = useCounterStore();
// 第一次改变store状态 $path对象形式
// const addCounter = () => {
//   counterStore.$patch({
//     counter: counterStore.counter + 1
//   })
// }
// 第二种修改store状态 $path 传递回调函数 第一个参数就是state
// const addCounter = () => {
//   counterStore.$patch((store) => {
//     store.counter++
//   })
// }
// 第三种修改store状态 直接通过store修改
// const addCounter = () => {
//   counterStore.counter++
// }
// 第四种修改store状态
const addCounter = () => {
  counterStore.addCounter();
};

// 访问state的状态两个方法
// !不能这样使用 因为丢掉了响应式
// const { counter, doubleCounter } = counterStore

// 一使用pinia自带的storeToRefs
const { counter, doubleCounter } = storeToRefs(counterStore);

// 二使用vue的computer 从store中读取
// const counter = computed(() => counterStore.counter)
// const doubleCounter = computed(() => counterStore.doubleCounter)

// 替换状态已有的属性值 相当于重新赋值而已
const replaceStore = () => {
  counterStore.$state = { counter: 20 };
};
function testAxios() {
  getTest().then((res: any) => {
    console.log(res);
  });
}
</script>
