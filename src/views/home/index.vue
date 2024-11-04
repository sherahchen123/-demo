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
    <van-button class="test-button" @click="goChild">toChild</van-button>
    <van-button id="goCesium" class="test-button" @click="goCesium">toCesium</van-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'index',
  setup() {
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

    onMounted(() => {
      // createMap();
    });

    return {
      chartOption,
      goBack,
      goChild,
      goCesium
    };
  }
});
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