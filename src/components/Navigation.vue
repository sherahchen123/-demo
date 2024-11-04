<!--
 * @Author: chenxiaoxuan
 * @Date: 2022-01-17 13:38:14
 * @LastEditTime: 2022-11-16 22:56:57
 * @LastEditors: chenxiaoxuan
 * @Description: 
-->
<template>
  <div class="menu">
    <van-nav-bar>
      <template #right>
        <van-dropdown-menu>
          <van-dropdown-item v-for="tool in tools" :key="tool.id" :title="tool.label">
            <van-cell-group v-if="tool.children">
              <van-cell
                v-for="(subitem, subindex) in tool.children"
                :key="subindex"
                :title="subitem.label"
                @click="handleOpenTool(subitem)"
              />
            </van-cell-group>
          </van-dropdown-item>
        </van-dropdown-menu>
      </template>
    </van-nav-bar>
    <!-- <remark v-show="remarkshow"></remark>
    <VisibilityAnalysis v-show="vaShow"></VisibilityAnalysis>
    <SkylineAnalysis v-show="saShow"></SkylineAnalysis>
    <ShadowAnalysis v-show="shadowShow" style="width: 40vmin; position: absolute; right: 0vmin;"></ShadowAnalysis>
    <HeightLimitAnalysis v-show="hlshow"></HeightLimitAnalysis>
    <lightSetting v-show="lsshow"></lightSetting>
    <SlopeAspectAnalysis v-show="slopeshow"></SlopeAspectAnalysis> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
// import { dora } from "@/utils/doraManager";
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
  float: right;
  height: 100%;
  position: relative;
  top: 2rem;
  width: 25vmin;
}
</style>
