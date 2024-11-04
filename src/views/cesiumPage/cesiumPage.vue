<!--
 * @Author: chenxiaoxuan
 * @Date: 2023-05-08 16:15:13
 * @LastEditTime: 2023-06-02 09:20:16
 * @LastEditors: chenxiaoxuan
 * @Description: 
-->
<template>
  <div>
    <div id="cesiumContainer"></div>
    <div id="threeContainer"></div>
    <van-button class="test-button" @click="goChild">toChild</van-button>
    <van-button class="test-button" @click="goBack">toMain</van-button>
    <van-button class="test-button" @click="locate">locate</van-button>
    <navigation :tools="tools"></navigation>
  </div>
</template>
<script setup lang="ts">
import { Viewer } from "cesium";
import * as Cesium from "cesium";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import * as THREE from "three";
import Navigation from "@/components/Navigation.vue";
import { getSpaceToolsConfig } from "@/api/index";

// import workerUrl from 'gdal3.js/dist/package/gdal3.js?url'
// import dataUrl from 'gdal3.js/dist/package/gdal3WebAssembly.data?url'
// import wasmUrl from 'gdal3.js/dist/package/gdal3WebAssembly.wasm?url'
// import initGdalJs from 'gdal3.js';

// const paths = {
//   wasm: wasmUrl,
//   data: dataUrl,
//   js: workerUrl,
// };

// const count = ref(0);
// initGdalJs({paths}).then((Gdal) => {
//     count.value = Object.keys(Gdal.drivers.raster).length + Object.keys(Gdal.drivers.vector).length;
// });

let tools: any = [];
tools = getConfig();
let three = {
  renderer: null,
  camera: null,
  scene: null,
};
let _3Dobjects: any = [];
let minWGS84 = [115.23, 39.55];
let maxWGS84 = [116.23, 41.55];
let minWGS841 = [116.23, 39.55];
let maxWGS841 = [117.23, 41.55];
// let ThreeContainer: any = null;
const router = useRouter();
async function getConfig() {
  await getSpaceToolsConfig()
    .then((res) => {
      console.log(res);
      return res
    })
    .catch(() => {
      throw new Error("err.message");
    });
}
function goBack() {
  router.push({ path: "/" });
}
function goChild() {
  router.push({ name: "next" });
}
function initThree() {
  let fov = 45;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let aspect = width / height;
  let near = 1;
  let far = 10 * 1000 * 1000;
  three.scene = new THREE.Scene();
  three.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  three.renderer = new THREE.WebGLRenderer({ alpha: true });
  let Amlight = new THREE.AmbientLight(0xffffff, 2);
  three.scene.add(Amlight);
  // 注意这里，直接把three容器（canvas 添加到 cesium中，在cesium的canvas之下），
  // 这样的话，两个canvas才会重叠起来。
  // viewer.cesiumWidget.canvas.parentElement.appendChild(
  //   three.renderer.domElement
  // );
  const ThreeContainer = document.getElementById("threeContainer");
  ThreeContainer.appendChild(three.renderer.domElement);
}
function init3DObject() {
  let entity = {
    name: "Polygon",
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray([
        minWGS84[0],
        minWGS84[1],
        maxWGS84[0],
        minWGS84[1],
        maxWGS84[0],
        maxWGS84[1],
        minWGS84[0],
        maxWGS84[1],
      ]),
      material: Cesium.Color.RED.withAlpha(0.2),
    },
  };
  viewer.entities.add(entity);
  // Lathe geometry
  const geometry = new THREE.DodecahedronGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  let dodecahedronMesh = new THREE.Mesh(geometry, material);
  // let dodecahedronMesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
  dodecahedronMesh.scale.set(15000, 15000, 15000); //scale object to be visible at planet scale
  dodecahedronMesh.position.z += 25000.0; // translate "up" in Three.js space so the "bottom" of the mesh is the handle
  dodecahedronMesh.rotation.x = Math.PI / 2; // rotate mesh for Cesium's Y-up system
  let dodecahedronMeshYup = new THREE.Group();
  dodecahedronMeshYup.add(dodecahedronMesh);
  three.scene.add(dodecahedronMeshYup); // don’t forget to add it to the Three.js scene manually
  //Assign Three.js object mesh to our object array
  const _3DOB = new _3DObject(dodecahedronMeshYup, minWGS84, maxWGS84);
  _3Dobjects.push(_3DOB);

  // cube
  const geometry1 = new THREE.BoxGeometry();
  const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const dodecahedronMesh1 = new THREE.Mesh(geometry1, material1);
  dodecahedronMesh1.scale.set(15000, 15000, 15000); //scale object to be visible at planet scale
  dodecahedronMesh1.position.z += 7000.0; // translate "up" in Three.js space so the "bottom" of the mesh is the handle
  dodecahedronMesh1.rotation.x = Math.PI / 2; // rotate mesh for Cesium's Y-up system
  let dodecahedronMeshYup1 = new THREE.Group();
  dodecahedronMeshYup1.add(dodecahedronMesh1);
  three.scene.add(dodecahedronMeshYup1); // don’t forget to add it to the Three.js scene manually
  //Assign Three.js object mesh to our object array
  const _3DOB1 = new _3DObject(dodecahedronMeshYup, minWGS841, maxWGS841);
  _3Dobjects.push(_3DOB1);
}
class _3DObject {
  graphMesh: any;
  minWGS84: any;
  maxWGS84: any;
  constructor(graphMesh: any, minWGS84: any, maxWGS84: any) {
    this.graphMesh = graphMesh; //Three.js 3DObject.mesh
    this.minWGS84 = minWGS84; //location bounding box
    this.maxWGS84 = maxWGS84;
  }
}
function loop() {
  requestAnimationFrame(loop);
  renderCesium();
  renderThreeObj();
}
function renderCesium() {
  viewer.render();
}
function renderThreeObj() {
  // register Three.js scene with Cesium
  three.camera.fov = Cesium.Math.toDegrees(viewer.camera.frustum.fovy); // ThreeJS FOV is vertical
  //three.camera.updateProjectionMatrix();
  let cartToVec = function (cart) {
    return new THREE.Vector3(cart.x, cart.y, cart.z);
  };

  // Configure Three.js meshes to stand against globe center position up direction
  for (let id in _3Dobjects) {
    minWGS84 = _3Dobjects[id].minWGS84;
    maxWGS84 = _3Dobjects[id].maxWGS84;
    // convert lat/long center position to Cartesian3
    let center = Cesium.Cartesian3.fromDegrees(
      (minWGS84[0] + maxWGS84[0]) / 2,
      (minWGS84[1] + maxWGS84[1]) / 2
    );
    // get forward direction for orienting model
    let centerHigh = Cesium.Cartesian3.fromDegrees(
      (minWGS84[0] + maxWGS84[0]) / 2,
      (minWGS84[1] + maxWGS84[1]) / 2,
      1
    );
    // use direction from bottom left to top left as up-vector
    let bottomLeft = cartToVec(
      Cesium.Cartesian3.fromDegrees(minWGS84[0], minWGS84[1])
    );
    let topLeft = cartToVec(
      Cesium.Cartesian3.fromDegrees(minWGS84[0], maxWGS84[1])
    );
    let latDir = new THREE.Vector3()
      .subVectors(bottomLeft, topLeft)
      .normalize();
    // configure entity position and orientation
    _3Dobjects[id].graphMesh.position.copy(center);
    _3Dobjects[id].graphMesh.lookAt(centerHigh.x, centerHigh.y, centerHigh.z);
    _3Dobjects[id].graphMesh.up.copy(latDir);
  }
  // Clone Cesium Camera projection position so the
  // Three.js Object will appear to be at the same place as above the Cesium Globe
  three.camera.matrixAutoUpdate = false;
  let cvm = viewer.camera.viewMatrix;
  let civm = viewer.camera.inverseViewMatrix;

  // 注意这里，经大神博客得知，three高版本这行代码需要放在 three.camera.matrixWorld 之前
  three.camera.lookAt(0, 0, 0);

  three.camera.matrixWorld.set(
    civm[0],
    civm[4],
    civm[8],
    civm[12],
    civm[1],
    civm[5],
    civm[9],
    civm[13],
    civm[2],
    civm[6],
    civm[10],
    civm[14],
    civm[3],
    civm[7],
    civm[11],
    civm[15]
  );

  three.camera.matrixWorldInverse.set(
    cvm[0],
    cvm[4],
    cvm[8],
    cvm[12],
    cvm[1],
    cvm[5],
    cvm[9],
    cvm[13],
    cvm[2],
    cvm[6],
    cvm[10],
    cvm[14],
    cvm[3],
    cvm[7],
    cvm[11],
    cvm[15]
  );
  const cesiumContainer = document.getElementById("cesiumContainer");
  // 设置three宽高
  let width = cesiumContainer.clientWidth;
  let height = cesiumContainer.clientHeight;

  let aspect = width / height;
  three.camera.aspect = aspect;
  three.camera.updateProjectionMatrix();
  three.renderer.setSize(width, height);
  three.renderer.clear();
  three.renderer.render(three.scene, three.camera);
}
function locate() {
  //地球自转
  viewer.clock.multiplier = 200;
  viewer.clock.shouldAnimate = true;
  let previousTime = viewer.clock.currentTime.secondsOfDay;
  let onTickCallback = function () {
    const spinRate = 1;
    const currentTime = viewer.clock.currentTime.secondsOfDay;
    const delta = (currentTime - previousTime) / 1000;
    previousTime = currentTime;
    viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate * delta);
  };
  viewer.clock.onTick.addEventListener(onTickCallback);
  setTimeout(() => {
    viewer.clock.onTick.removeEventListener(onTickCallback);
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        121.76957109762957,
        37.16822205644316,
        331838.43584221626
      ),
      orientation: {
        heading: 6.283185307179586,
        pitch: -1.5685585683149283,
        roll: 6.283185307179586,
      },
      maximumHeight: 10,
      pitchAdjustHeight: 0,
    });
    //加个威海行政区划图层
    const _provider = new Cesium.ArcGisMapServerImageryProvider({
      url: "http://192.168.1.195:6080/arcgis/rest/services/WH/XZQHBJ/MapServer",
      enablePickFeatures: false,
    });
    viewer.imageryLayers.addImageryProvider(_provider);
    debugger;
  }, 4500);
}
let viewer: any = null;
let cesiumKey: any =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1Mjc2NjEwYS0zOTI1LTQwMjYtODc5ZC00MDQzZjUzNjdjOTUiLCJpZCI6MTQzNDc3LCJpYXQiOjE2ODU2MTIzODl9.z97aaNTIbK4qmvEAXUY2N6AxeLuY0NvrROdQMKoqVcM";
onMounted(() => {
  Cesium.Ion.defaultAccessToken = cesiumKey;
  viewer = new Viewer("cesiumContainer", {
    animation: true, // * 左下角圆盘 速度控制器
    shouldAnimate: true, // * 当动画控件出现，用来控制是否通过旋转控件，旋转场景
    baseLayerPicker: true, // * 右上角图层选择器
    fullscreenButton: false, // * 右下角全屏按钮
    vrButton: false, // * 右下角vr按钮
    homeButton: false, // * 右上角地图恢复到初始页面按钮
    selectionIndicator: false, // * 点击后地图上显示的选择控件
    infoBox: false, // * 右上角鼠标点击后信息展示框
    sceneModePicker: false, // * 右上角2D和3D之间的切换
    timeline: true, // * 页面下方的时间条
    navigationHelpButton: false, // * 右上角帮助按钮
    navigationInstructionsInitiallyVisible: false, // * 是否展开帮助
    scene3DOnly: true, // * 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
    useDefaultRenderLoop: false, // * 控制渲染循环
    showRenderLoopErrors: false, // * HTML面板中显示错误信息
    useBrowserRecommendedResolution: true, // * 如果为true，则以浏览器建议的分辨率渲染并忽略window.devicePixelRatio
    automaticallyTrackDataSourceClocks: true, // * 自动追踪最近添加的数据源的时钟设置
    orderIndependentTranslucency: true, // * 如果为true并且配置支持它，则使用顺序无关的半透明性
    shadows: false, // * 阴影效果
    projectionPicker: false, // * 透视投影和正投影之间切换
    requestRenderMode: true, // * 在指定情况下进行渲染,提高性能

    contextOptions: {
      webgl: {
        alpha: false,
        antialias: true,
        preserveDrawingBuffer: true,
        failIfMajorPerformanceCaveat: false,
        depth: true,
        stencil: false,
        // anialias: false
      },
    },

    targetFrameRate: 60,
    // resolutionScale: 0.1,
    // orderIndependentTranslucency: true,
    //加载底图
    // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
    //   url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
    // }),
    geocoder: false,
    // automaticallyTrackDataSourceClocks: false,
    // creditContainer : "hidecredit", //注意：这里需要注释掉，否则会报找不到容器的问题
    // clock: null,
    terrainShadows: Cesium.ShadowMode.DISABLED,
  });
  viewer._cesiumWidget._creditContainer.style.display = "none"; // * 隐藏版权信息
  viewer.scene.globe.depthTestAgainstTerrain = true; // * 开启深度测试

  viewer.bottomContainer.style.display = "none"; //隐藏bottomContainervar
  // imageList = viewer.baseLayerPicker.viewModel.imageryProviderViewModels;//使用第4个（索引为3,内容为ESRI世界影像）imageryProvider作为默认的地形数据提供者//以免使用默认的BING服务，有时刷不出图像的情况
  // viewer.baseLayerPicker.viewModel.selectedImagery = imageList[3];
  let elem: any = document.getElementsByClassName(
    `cesium-viewer-animationContainer`
  )[0];
  elem.style.setProperty("display", "none");
  viewer.scene.screenSpaceCameraController.enableCollisionDetection = false; //禁用碰撞检测，允许`Cesium`相机穿透物体和进入地下
  //天地图注记服务
  // let imageLabelCn: any = new Cesium.ImageryLayer(
  //   new Cesium.WebMapTileServiceImageryProvider({
  //     url: "http://t0.tianditu.com/cia_w/wmts?tk=a2ca005a710864da5d797e35e0f45b3b",
  //     layer: "cia",
  //     style: "default",
  //     format: "tiles",
  //     tileMatrixSetID: "w",
  //     maximumLevel: 18,
  //   })
  // );
  // viewer.scene.imageryLayers.add(imageLabelCn);

  // threejs初始化
  initThree();
  init3DObject();
  loop();
  // viewer.camera.flyTo({
  //   destination: Cesium.Cartesian3.fromDegrees(115.23, 39.55, 1000),
  //   orientation: {
  //     heading: 6.283185307179586,
  //     pitch: -1.5685585683149283,
  //     roll: 6.283185307179586,
  //   },
  //   maximumHeight: 10,
  //   pitchAdjustHeight: 0,
  // });
  // const promise = viewer.scene.open(
  //   "http://58.246.138.178:9029/iserver/services/3D-WeiHaiChengShiSheJi/rest/realspace"
  // );
  // promise.then(() => {
  //   viewer.flyTo(promise);
  // });
});
</script>
<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  position: absolute;
}
#threeContainer {
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
  cursor: default;
}
.test-button {
  width: 20%;
  margin-left: 1vmin;
}
.button {
  position: absolute;
  top: 0rem;
  left: 0rem;
  width: 0.11rem;
  height: 0.11rem;
}
</style>
