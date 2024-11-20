<!--
 * @Author: chenxiaoxuan
 * @Date: 2023-05-08 14:04:45
 * @LastEditTime: 2023-05-08 17:33:08
 * @LastEditors: chenxiaoxuan
 * @Description: 
-->
<template>
  <div class="container">
    <div class="header" v-if="activeTab === 'video'">
      <van-button @click="goBack">toMain</van-button>
      <van-button @click="addCounter">counter++++</van-button>
      <van-button @click="replaceStore">替换state状态值</van-button>
      <van-button @click="testAxios">调用测试接口</van-button>
    </div>
    <div class="content">
      <div v-if="activeTab === 'video'" class="video-wrapper">
        <!-- 视频播放器 -->
        <div class="video-container">
          <video ref="videoPlayer" width="640" height="360" @timeupdate="updateProgress">
            <source :src="videoSrc" type="video/mp4">
            您的浏览器不支持 HTML5 视频标签。
          </video>
          <div class="controls">
            <button @click="togglePlayPause" class="play-pause-button">
              {{ isPlaying ? '暂停' : '播放' }}
            </button>
            <div class="progress-bar" @click="seek">
              <div class="progress" :style="{ width: progress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="activeTab === 'echarts'">
        <div class="echarts-container">
          <div ref="radarChart" class="radar-chart"></div>
        </div>
      </div>
      <div v-else-if="activeTab === 'other'">
        <div>这里是其他内容</div>
      </div>
    </div>

    <!-- Tab 切换 -->
    <div class="tab-container">
      <div @click="setActiveTab('video')" :class="{ active: activeTab === 'video' }">视频浏览</div>
      <div @click="setActiveTab('echarts')" :class="{ active: activeTab === 'echarts' }">echarts图表</div>
      <div @click="setActiveTab('other')" :class="{ active: activeTab === 'other' }">其他</div>
    </div>
    <div class="bottom-bar"></div> <!-- 底部黑色条 -->
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick, watch, inject } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const activeTab = ref('video'); // 默认显示左边的 tab
const videoSrc = ref('/static/测试视频.mp4'); // 替换为视频源路径
const isPlaying = ref(false);
const progress = ref(0);
const videoPlayer = ref<HTMLVideoElement | null>(null); // 使用 ref 来引用视频元素
const radarChart = ref(null); // 用于引用雷达图

const echarts = inject('$echarts'); // 注入 ECharts

// 在 setup 中直接使用全局属性
const app = (window as any).__VUE_APP__; // 确保 app 是可用的

function setActiveTab(tab: string) {
  activeTab.value = tab;
}

function goBack() {
  router.push({ path: "/" });
}

function togglePlayPause() {
  if (videoPlayer.value) { // 确保 videoPlayer 存在
    if (isPlaying.value) {
      videoPlayer.value.pause();
    } else {
      videoPlayer.value.play();
    }
    isPlaying.value = !isPlaying.value;
  }
}

function updateProgress() {
  if (videoPlayer.value) { // 确保 videoPlayer 存在
    progress.value = (videoPlayer.value.currentTime / videoPlayer.value.duration) * 100;
  }
}

function seek(event: MouseEvent) {
  if (videoPlayer.value) { // 确保 videoPlayer 存在
    const progressBar = event.currentTarget as HTMLElement;
    const clickPosition = event.offsetX / progressBar.clientWidth;
    videoPlayer.value.currentTime = clickPosition * videoPlayer.value.duration;
  }
}

// 监听 activeTab 的变化
watch(activeTab, async (newTab) => {
  if (newTab === 'echarts') {
    await nextTick(); // 确保 DOM 更新完成
    const radarElement = radarChart.value; // 获取 DOM 元素

    if (radarElement && echarts) {
      const myChart = echarts.init(radarElement); // 使用注入的 ECharts

      if (myChart) { // 确保 myChart 是有效的
        const option = {
          title: {
            text: '雷达图示例',
            left: 'center'
          },
          tooltip: {},
          legend: {
            data: ['数据1'],
            orient: 'vertical',
            right: '10%',
            top: '20%'
          },
          radar: {
            radius: '50%',
            indicator: [
              { name: 'Indicator1', max: 150 },
              { name: 'Indicator2', max: 150 },
              { name: 'Indicator3', max: 150 },
              { name: 'Indicator4', max: 150 },
              { name: 'Indicator5', max: 150 },
              { name: 'Indicator6', max: 150 }
            ]
          },
          series: [{
            name: '数据1',
            type: 'radar',
            data: [
              {
                value: [120, 118, 130, 100, 99, 70],
                name: '数据1'
              }
            ],
            areaStyle: {
              normal: {
                color: 'rgba(255, 0, 0, 0.5)'
              }
            }
          }]
        };
        myChart.setOption(option); // 设置图表选项
      } else {
        console.error("ECharts 初始化失败，myChart 为 undefined");
      }
    } else {
      console.error("雷达图 DOM 元素未找到或 ECharts 未注入");
    }
  }
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 使容器占满整个视口高度 */
}

.header {
  display: flex;
  justify-content: space-around; /* 水平分布按钮 */
  padding: 10px 0; /* 上下内边距 */
  background-color: #f0f0f0; /* 背景颜色 */
}

.content {
  flex: 1; /* 使内容区域占满剩余空间 */
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.video-wrapper {
  text-align: center; /* 使视频和控件居中 */
}

.echarts-container {
  width: 10rem; /* 宽度为屏幕宽度的80% */
  margin: 0 auto; /* 居中 */
}

.radar-chart {
  width: 100%; /* 确保宽度设置 */
  height: 400px; /* 确保高度设置 */
}

.controls {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.play-pause-button {
  background: none;
  border: none;
  font-size: 14px; /* 缩小字体大小 */
  cursor: pointer;
  padding: 5px; /* 添加一些内边距 */
  margin-left: 4rem;
}

.progress-bar {
  width: 40%;
  height: 5px;
  background-color: #ddd;
  cursor: pointer;
  margin-left: 10px;
}

.progress {
  height: 100%;
  background-color: #007bff; /* 进度条颜色 */
}

.tab-container {
  display: flex;
  justify-content: space-around;
  background-color: #f0f0f0;
  padding: 5px 0; /* 减小内边距 */
  width: 100%; /* 宽度占满 */
  margin-bottom: 0.28rem;
}

.tab-container div {
  cursor: pointer;
  padding: 5px; /* 减小按钮内边距 */
  flex: 1; /* 平均分配空间 */
  text-align: center; /* 文本居中 */
  font-size: 14px; /* 缩小字体大小 */
}

.tab-container div.active {
  background-color: #666; /* 稍微浅一点的灰色背景 */
  color: white; /* 白色文字 */
}

.bottom-bar {
  height: 2px; /* 底部条的高度 */
  background-color: #333; /* 深灰色底部条 */
  width: 100%; /* 宽度占满 */
}
</style>

<!-- 在 <head> 中引入 Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
