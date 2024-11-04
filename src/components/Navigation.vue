<!--
 * @Author: chenxiaoxuan
 * @Date: 2022-01-17 13:38:14
 * @LastEditTime: 2022-11-16 22:56:57
 * @LastEditors: chenxiaoxuan
 * @Description: 
-->
<template>
  <div class="menu">
    <van-dropdown-menu class="custom-dropdown">
      <van-dropdown-item 
        v-for="tool in tools" 
        :key="tool.id" 
        :title="tool.label"
        :overlay="false"
        :teleport="null"
      >
        <van-cell-group v-if="tool.children">
          <van-cell
            v-for="(subitem, subindex) in tool.children"
            :key="subindex"
            :title="subitem.label"
            @click="handleOpenTool(subitem)"
            class="custom-cell"
          />
        </van-cell-group>
      </van-dropdown-item>
    </van-dropdown-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
// import Remark from "./Remark/Remark.vue";
// import VisibilityAnalysis from "./VisibilityAnalysis/VisibilityAnalysis.vue";
// import SkylineAnalysis from "./SkylineAnalysis/SkylineAnalysis.vue";
// import ShadowAnalysis from "./ShadowAnalysis/ShadowAnalysis.vue";
// import HeightLimitAnalysis from "./HeightLimitAnalysis/HeightLimitAnalysis.vue";
// import lightSetting from "./LightSetting/lightSetting.vue";
// import SlopeAspectAnalysis from "./SlopeAspectAnalysis/SlopeAspectAnalysis.vue";

interface Tool {
  id: string;
  label: string;
  children?: {
    code: string;
    label: string;
  }[];
}

export default defineComponent({
  name: 'Navigation',
  components: {
    // Remark,
    // VisibilityAnalysis,
    // SkylineAnalysis,
    // ShadowAnalysis,
    // HeightLimitAnalysis,
    // lightSetting,
    // SlopeAspectAnalysis
  },
  props: {
    tools: {
      type: Array as () => Tool[],
      default: () => []
    }
  },
  setup() {
    const collapsed = ref(false);
    const remarkshow = ref(false);
    const vaShow = ref(false);
    const saShow = ref(false);
    const shadowShow = ref(false);
    const hlshow = ref(false);
    const lsshow = ref(false);
    const slopeshow = ref(false);

    // provide('dora', dora);

    const handleOpenTool = (subitem: { label: string; code: string }) => {
      console.log(subitem.code);
    //   switch (subitem.label) {
    //     case "标注":
    //       remarkshow.value = !remarkshow.value;
    //       break;
    //     case "通视分析":
    //       vaShow.value = !vaShow.value;
    //       break;
    //     case "天际线分析":
    //       saShow.value = !saShow.value;
    //       break;
    //     case "阴影分析":
    //       shadowShow.value = !shadowShow.value;
    //       break;
    //     case "限高分析":
    //       hlshow.value = !hlshow.value;
    //       break;
    //     case "光源设置":
    //       lsshow.value = !lsshow.value;
    //       break;
    //     case "坡度分析":
    //       slopeshow.value = !slopeshow.value;
    //       break;
    //   }
    };

    return {
      collapsed,
      remarkshow,
      vaShow,
      saShow,
      shadowShow,
      hlshow,
      lsshow,
      slopeshow,
      handleOpenTool
    };
  }
});
</script>

<style scoped lang='scss'>
.menu {
  position: fixed;
  bottom: 8vh;
  left: 50%;
  transform: translateX(-50%);
  width: 10rem;
  z-index: 2000;
}

:deep(.custom-dropdown) {
  width: 100%;
  background: transparent;
  
  .van-dropdown-menu__bar {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    height: 2rem;
  }

  .van-dropdown-item__content {
    width: 10rem !important;
    position: fixed !important;
    top: auto !important;
    bottom: calc(8vh + 0.3rem) !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    background: #ffffff !important;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    max-height: 40vh;
    overflow-y: auto;
    z-index: 2001;
    opacity: 1 !important;
    visibility: visible !important;
    display: block !important;
  }

  .van-cell {
    font-size: 0.45rem;
    font-weight: normal;
    padding: 2px 8px;
    line-height: 1.2;
    background: #ffffff;
    font-family: SimSun, "宋体", serif;
    text-align: center;
    border: none;
    margin: 0;
    
    &:active {
      background-color: #f5f5f5;
    }

    &--active {
      color: #1989fa;
    }

    .van-cell__title {
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }
  }

  .van-overlay {
    display: none !important;
  }

  .van-dropdown-item--down {
    .van-dropdown-item__content {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
  }
}

@keyframes dropDown {
  from {
    opacity: 0;
    transform: translate(-50%, 10px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.van-dropdown-item__content {
  animation: dropDown 0.2s ease-out forwards;
}

:deep(.van-dropdown-item__content::-webkit-scrollbar) {
  width: 4px;
}

:deep(.van-dropdown-item__content::-webkit-scrollbar-thumb) {
  background: #ddd;
  border-radius: 2px;
}

:deep(.van-dropdown-item__content::-webkit-scrollbar-track) {
  background: transparent;
}
</style>
