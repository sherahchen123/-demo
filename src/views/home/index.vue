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
    <div v-if="uploadedImage" class="image-container">
      <img :src="uploadedImage" :style="imageStyle" alt="uploaded image" />
    </div>
    <input
      type="file"
      ref="fileInput"
      accept="image/*"
      style="display: none"
      @change="handleFileChange"
    />
    <div class="left-buttons">
      <van-button class="effect-button" @click="handleEffect(1)"
        >canvas图片像素化</van-button
      >
      <van-button class="effect-button" @click="handleEffect(2)"
        >canvas底片处理</van-button
      >
      <van-button class="effect-button" @click="handleEffect(3)"
        >canvas黑白效果</van-button
      >
      <van-button class="effect-button" @click="handleEffect(4)"
        >canvas变亮</van-button
      >
      <van-button class="effect-button" @click="handleEffect(5)"
        >canvas变暗</van-button
      >
      <van-button class="effect-button" @click="handleEffect(6)"
        >canvas复古</van-button
      >
      <van-button class="effect-button" @click="handleEffect(7)"
        >canvas透明</van-button
      >
      <van-button class="effect-button" @click="handleEffect(8)"
        >webgl高斯模糊</van-button
      >
      <van-button class="effect-button" @click="handleEffect(9)"
        >threejs效果</van-button
      >
      <van-button class="effect-button" @click="handleEffect(10)"
        >重置</van-button
      >
    </div>
    <van-button class="test-button" @click="goChild">toChild</van-button>
    <van-button id="goCesium" class="test-button" @click="goCesium"
      >toCesium</van-button
    >
    <van-button id="upload" class="test-button" @click="uploadPic"
      >uploadPic</van-button
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import * as THREE from 'three';

export default defineComponent({
  name: "index",
  setup() {
    const router = useRouter();
    const fileInput = ref<HTMLInputElement | null>(null);
    const uploadedImage = ref<string>("");
    const imageStyle = ref({
      width: "70%",
      height: "70%",
      objectFit: "contain" as const,
    });
    const center = [0, 0];
    let map: any = null;

    const chartOption = {
      title: {
        text: "ECharts 入门示例",
      },
      tooltip: {},
      legend: {
        data: ["销量"],
      },
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "bar",
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    };
    // canvas
    const canvas = ref<HTMLCanvasElement | null>(null);
    const context = ref<CanvasRenderingContext2D | null>(null);
    const currentImage = ref<HTMLImageElement | null>(null);
    // webgl
    const glCanvas = ref<HTMLCanvasElement | null>(null);
    const gl = ref<WebGLRenderingContext | null>(null);
    const program = ref<WebGLProgram | null>(null);
    //threejs
    const scene = ref<THREE.Scene | null>(null);
    const camera = ref<THREE.PerspectiveCamera | null>(null);
    const renderer = ref<THREE.WebGLRenderer | null>(null);
    const cube = ref<THREE.Mesh | null>(null);
    const animationFrameId = ref<number | null>(null);

    function goBack() {
      router.push({ path: "/" });
    }

    function goChild() {
      router.push({ name: "next" });
    }

    function goCesium() {
      router.push({ name: "cesiumPage" });
    }
    const uploadPic = () => {
      fileInput.value?.click();
    };
    const handleFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
          if (e.target?.result) {
            const img = new Image();
            img.onload = () => {
              currentImage.value = img;

              if (canvas.value) {
                canvas.value.width = img.width;
                canvas.value.height = img.height;

                context.value?.drawImage(img, 0, 0, img.width, img.height);
                uploadedImage.value = canvas.value.toDataURL("image/png");
              }
            };
            img.src = e.target.result as string;
          }
        };

        reader.readAsDataURL(file);
      }
      if (target) target.value = "";
    };
    const handleEffect = (type: number) => {
      if (
        !uploadedImage.value ||
        !context.value ||
        !canvas.value ||
        !currentImage.value
      ) {
        console.warn("请先上传图片");
        return;
      }
      const imageData = context.value.getImageData(
        0,
        0,
        canvas.value.width,
        canvas.value.height
      );
      const data = imageData.data;
      switch (type) {
        case 1: // canvas图片像素化
          const ctx = canvas.value.getContext("2d");
          if (!ctx || !currentImage.value) return;
          // 重新绘制原图
          ctx.drawImage(currentImage.value, 0, 0, canvas.value.width, canvas.value.height);
          // 设置像素块大小
          const pixelSize = 4;
          // 获取图像数据
          const imgData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height);
          // 逐块处理像素
          for (let y = 0; y < canvas.value.height; y += pixelSize) {
            for (let x = 0; x < canvas.value.width; x += pixelSize) {
              const i = (y * canvas.value.width + x) * 4;
              // 获取像素块左上角的颜色
              const color = `rgb(${imgData.data[i]},${imgData.data[i + 1]},${imgData.data[i + 2]})`;
              // 用该颜色填充整个像素块
              ctx.fillStyle = color;
              ctx.fillRect(x, y, pixelSize, pixelSize);
            }
          }
          // 更新显示的图片
          uploadedImage.value = canvas.value.toDataURL("image/png");
          break;

        case 2: // canvas底片处理
          for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i]; // R
            data[i + 1] = 255 - data[i + 1]; // G
            data[i + 2] = 255 - data[i + 2]; // B
          }

          context.value.putImageData(imageData, 0, 0);
          uploadedImage.value = canvas.value.toDataURL("image/png");
          break;

        case 3: // canvas黑白效果
          for (var i = 0; i < data.length; i += 4) {
            // var average = (data[i + 0] + data[i + 1] + data[i + 2]) / 3; 容易泛白
            var average =
              data[i + 0] * 0.3 + data[i + 1] * 0.6 + data[i + 2] * 0.1;
            data[i + 0] = average;
            data[i + 1] = average;
            data[i + 2] = average;
          }
          // 设置像素数据
          context.value.putImageData(imageData, 0, 0);
          uploadedImage.value = canvas.value.toDataURL("image/png");
          break;

        case 4: // canvas变亮
          for (var i = 0; i < data.length; i += 4) {
            var brightness = 50;
            data[i + 0] += brightness;
            data[i + 1] += brightness;
            data[i + 2] += brightness;
          }
          context.value.putImageData(imageData, 0, 0);
          uploadedImage.value = canvas.value.toDataURL("image/png");
          break;

        case 5: // canvas
          for (var i = 0; i < data.length; i += 4) {
            var brightness = 50;
            data[i + 0] -= brightness;
            data[i + 1] -= brightness;
            data[i + 2] -= brightness;
          }
          context.value.putImageData(imageData, 0, 0);
          uploadedImage.value = canvas.value.toDataURL("image/png");
          break;

        case 6: // canvas复古 每一个颜色做加权处理
          for (var i = 0; i < data.length; i += 4) {
            data[i + 0] =
              0.39 * data[i + 0] + 0.76 * data[i + 1] + 0.18 * data[i + 2];
            data[i + 1] =
              0.35 * data[i + 0] + 0.68 * data[i + 1] + 0.16 * data[i + 2];
            data[i + 2] =
              0.27 * data[i + 0] + 0.53 * data[i + 1] + 0.13 * data[i + 2];
          }
          context.value.putImageData(imageData, 0, 0);
          uploadedImage.value = canvas.value.toDataURL("image/png");
          break;

        case 7: // canvas透明
          for (var i = 0; i < data.length; i += 4) {
            data[i + 3] = 0.5 * data[i + 3];
          }
          context.value.putImageData(imageData, 0, 0);
          uploadedImage.value = canvas.value.toDataURL("image/png");
          break;

        case 8: // webgl高斯模糊
          if (!gl.value || !currentImage.value || !glCanvas.value) {
            console.warn("WebGL 初化失败或未上传图片");
            return;
          }

          // 初始化 WebGL
          const prog = initWebGL(gl.value);
          
          if (!prog) {
            console.warn("WebGL 程序初始化失败");
            return;
          }

          // 设置画布尺寸
          glCanvas.value.width = currentImage.value.width;
          glCanvas.value.height = currentImage.value.height;
          gl.value.viewport(0, 0, glCanvas.value.width, glCanvas.value.height);

          // 使用着色程序
          gl.value.useProgram(prog);

          // 设置纹理单元
          gl.value.activeTexture(gl.value.TEXTURE0);
          const u_image = gl.value.getUniformLocation(prog, "u_image");
          gl.value.uniform1i(u_image, 0);

          // 设置纹理大小
          const u_textureSize = gl.value.getUniformLocation(prog, "u_textureSize");
          gl.value.uniform2f(u_textureSize, glCanvas.value.width, glCanvas.value.height);

          // 创建并设置纹理
          const texture = gl.value.createTexture();
          gl.value.bindTexture(gl.value.TEXTURE_2D, texture);
          gl.value.texParameteri(gl.value.TEXTURE_2D, gl.value.TEXTURE_WRAP_S, gl.value.CLAMP_TO_EDGE);
          gl.value.texParameteri(gl.value.TEXTURE_2D, gl.value.TEXTURE_WRAP_T, gl.value.CLAMP_TO_EDGE);
          gl.value.texParameteri(gl.value.TEXTURE_2D, gl.value.TEXTURE_MIN_FILTER, gl.value.LINEAR);
          gl.value.texParameteri(gl.value.TEXTURE_2D, gl.value.TEXTURE_MAG_FILTER, gl.value.LINEAR);
          gl.value.texImage2D(gl.value.TEXTURE_2D, 0, gl.value.RGBA, gl.value.RGBA, gl.value.UNSIGNED_BYTE, currentImage.value);

          // 清除画布
          gl.value.clearColor(0, 0, 0, 0);
          gl.value.clear(gl.value.COLOR_BUFFER_BIT);

          // 绘制
          gl.value.drawArrays(gl.value.TRIANGLE_STRIP, 0, 4);

          // 将结果复制到原始canvas
          context.value?.drawImage(glCanvas.value, 0, 0);
          uploadedImage.value = canvas.value.toDataURL("image/png");
          break;

        case 9: // threejs效果
          if (!currentImage.value) {
            console.warn("请先上传图片");
            return;
          }

          // 隐藏原图片
          const threejsImageContainer = document.querySelector('.image-container') as HTMLElement;
          if (threejsImageContainer) {
            threejsImageContainer.style.display = 'none';
          }

          // 清理之前的场景
          if (renderer.value) {
            if (animationFrameId.value) {
              cancelAnimationFrame(animationFrameId.value);
            }
            renderer.value.domElement.parentNode?.removeChild(renderer.value.domElement);
          }

          // 创建非响应式的 Three.js 对象
          const localScene = new THREE.Scene();
          const localCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
          const localRenderer = new THREE.WebGLRenderer({ antialias: true });
          
          localRenderer.setSize(window.innerWidth, window.innerHeight);
          localRenderer.setClearColor(0xf0f0f0);
          document.body.appendChild(localRenderer.domElement);

          // 添加光源
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
          localScene.add(ambientLight);

          const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
          directionalLight.position.set(5, 5, 5);
          localScene.add(directionalLight);

          // 创建立方体
          const geometry = new THREE.BoxGeometry(2, 2, 2);
          const cubeTexture = new THREE.TextureLoader().load(currentImage.value.src);
          const material = new THREE.MeshStandardMaterial({ 
            map: cubeTexture,
            side: THREE.DoubleSide
          });

          const localCube = new THREE.Mesh(geometry, material);
          localScene.add(localCube);
          localCamera.position.z = 5;

          // 保存引用到响应式变量中
          scene.value = localScene;
          camera.value = localCamera;
          renderer.value = localRenderer;
          cube.value = localCube;

          // 动画循环
          const animate = () => {
            if (!localCube || !localScene || !localCamera || !localRenderer) return;
            
            animationFrameId.value = requestAnimationFrame(animate);
            
            localCube.rotation.x += 0.01;
            localCube.rotation.y += 0.01;
            
            localRenderer.render(localScene, localCamera);
          };

          animate();
          break;

        case 10: // 重置
          if (!canvas.value || !context.value || !currentImage.value) return;
          
          // 显示原图片
          const resetImageContainer = document.querySelector('.image-container') as HTMLElement;
          if (resetImageContainer) {
            resetImageContainer.style.display = 'flex';
          }
          
          // 重置画布尺寸
          canvas.value.width = currentImage.value.width;
          canvas.value.height = currentImage.value.height;
          
          // 清除画布
          context.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
          
          // 重绘原图
          context.value.drawImage(currentImage.value, 0, 0, canvas.value.width, canvas.value.height);
          uploadedImage.value = canvas.value.toDataURL("image/png");
          
          // 清除 WebGL 画布
          if (gl.value && glCanvas.value) {
            gl.value.clear(gl.value.COLOR_BUFFER_BIT);
          }
          
          // 清除 Three.js 场景
          if (renderer.value) {
            if (animationFrameId.value) {
              cancelAnimationFrame(animationFrameId.value);
            }
            renderer.value.domElement.parentNode?.removeChild(renderer.value.domElement);
            renderer.value = null;
            scene.value = null;
            camera.value = null;
            cube.value = null;
          }
          break;

        default:
          console.warn("未知的效果类型");
          break;
      }
    };

    onMounted(() => {
      canvas.value = document.createElement("canvas");
      context.value = canvas.value.getContext("2d");
      
      // 检查 WebGL 支持
      glCanvas.value = document.createElement("canvas");
      gl.value = glCanvas.value.getContext("webgl");
      if (!gl.value) {
        console.warn("您的浏览器可能不支持 WebGL");
        return;
      }
    });

    function initWebGL(gl: WebGLRenderingContext) {
      try {
        // 创建着色器
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        
        if (!vertexShader || !fragmentShader) {
          console.error('创建着色器失败');
          return null;
        }

        // 顶点着色器源码
        const vertexShaderSource = `
          attribute vec2 a_position;
          attribute vec2 a_texCoord;
          varying vec2 v_texCoord;
          void main() {
            gl_Position = vec4(a_position, 0, 1);
            v_texCoord = a_texCoord;
          }
        `;

        // 修改片段着色器，增加采样点和权重
        const fragmentShaderSource = `
          precision mediump float;
          uniform sampler2D u_image;
          varying vec2 v_texCoord;
          
          void main() {
            vec4 sum = vec4(0.0);
            float step = 8.0/300.0;  // 适度增加步长
            
            // 3x3采样，但采样距离更大
            sum += texture2D(u_image, v_texCoord + vec2(-step, -step));
            sum += texture2D(u_image, v_texCoord + vec2(0.0, -step));
            sum += texture2D(u_image, v_texCoord + vec2(step, -step));
            sum += texture2D(u_image, v_texCoord + vec2(-step, 0.0));
            sum += texture2D(u_image, v_texCoord);
            sum += texture2D(u_image, v_texCoord + vec2(step, 0.0));
            sum += texture2D(u_image, v_texCoord + vec2(-step, step));
            sum += texture2D(u_image, v_texCoord + vec2(0.0, step));
            sum += texture2D(u_image, v_texCoord + vec2(step, step));
            
            gl_FragColor = sum / 9.0;
          }
        `;

        // 编译着色器
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
          console.error('顶点着色器编译错误:', gl.getShaderInfoLog(vertexShader));
          return null;
        }
        
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
          console.error('片段着色器编译错误:', gl.getShaderInfoLog(fragmentShader));
          return null;
        }

        // 创建程序
        const prog = gl.createProgram();
        if (!prog) {
          console.error('创建程序失败');
          return null;
        }

        // 附加着色器
        gl.attachShader(prog, vertexShader);
        gl.attachShader(prog, fragmentShader);
        
        // 链接程序
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
          console.error('程序链接错误:', gl.getProgramInfoLog(prog));
          return null;
        }

        // 验证程序
        gl.validateProgram(prog);
        if (!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)) {
          console.error('程序验证错误:', gl.getProgramInfoLog(prog));
          return null;
        }

        // 使用程序
        gl.useProgram(prog);

        // 清理着色器
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        // 保存程序引用
        program.value = prog;
        return prog;
      } catch (error) {
        console.error('WebGL 初始化错误:', error);
        return null;
      }
    }

    return {
      chartOption,
      goBack,
      goChild,
      goCesium,
      uploadPic,
      handleEffect,
      fileInput,
      handleFileChange,
      uploadedImage,
      imageStyle,
    };
  },
});
</script>

<style scoped>
.left-buttons {
  position: fixed;
  left: 0.3rem;
  top: 1.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.8vmin;
  z-index: 1000;
  width: 30vw;
}

.effect-button {
  width: 100%;
  height: 1rem;
  background-color: white !important;
  color: black !important;
  border: 1px solid #dcdfe6 !important;
  font-size: 0.28rem !important;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0 0.2rem !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1;
}

.effect-button:hover {
  background-color: #f5f7fa !important;
  border-color: #c0c4cc !important;
}

.effect-button:active {
  background-color: #e6e8eb !important;
}

.chart-item {
  width: 10rem;
  height: 10rem;
}

.test-button {
  width: 20%;
  margin-left: 1vmin;
  position: relative;
  z-index: 1001;
  font-size: 0.35rem !important;
}

#map {
  width: 100%;
  height: 100%;
  position: absolute;
}

.image-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  background-color: rgba(255, 255, 255, 0.9);
}

.image-container img {
  display: block;
  max-width: 70%;
  max-height: 70%;
  object-fit: contain;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
