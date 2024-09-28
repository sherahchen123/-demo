<!--
 * @Author: chenxiaoxuan
 * @Date: 2023-05-08 11:00:22
 * @LastEditTime: 2023-06-19 10:54:17
 * @LastEditors: chenxiaoxuan
 * @Description: 
-->
<template>
  <div>
    <div id="map"></div>
    <van-button class="test-button"  @click="goChild">toChild</van-button>
    <van-button class="test-button" @click="goCesium">toCesium</van-button>
    <!-- <div class="chart-box">
      <VChart :option="chartOption"></VChart>
    </div> -->
  </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
// import mapboxgl from "mapbox-gl";
import { onMounted } from "vue";
// import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
// import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
const router = useRouter();
const center = [0, 0];
let map: any = null;
const chartOption = {
  title: {
    text: "ECharts 入门示例"
  },
  tooltip: {},
  legend: {
    data: ["销量"]
  },
  xAxis: {
    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
  },
  yAxis: {},
  series: [
    {
      name: "销量",
      type: "bar",
      data: [5, 20, 36, 10, 10, 20]
    }
  ]
};
function goBack() {
  router.push({ path: "/" });
}
function goChild() {
  router.push({ name: "next" });
}
function goCesium() {
  router.push({ name: "cesiumPage" });
}
// function createMap() {
//   mapboxgl.accessToken = "";  // An API access token is required to use Mapbox GL. See https://docs.mapbox.com/api/overview/#access-tokens-and-token-scopes  需科学上网
//   try {
//     map = new mapboxgl.Map({
//       container: "map",
//       style: "mapbox://styles/mapbox/streets-v11",
//       center: center,
//       zoom: 11,
//     });
//   } catch (err) {
//     console.log("map error", err);
//   }
// }
onMounted(() => {
  // createMap();
})
</script>
<style scoped>
.chart-item {
  width: 10rem;
  height: 10rem;
}
.test-button {
  width: 20%;
  margin-left: 1vmin;
}
#map {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>