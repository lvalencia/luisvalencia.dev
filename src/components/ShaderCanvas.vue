<script setup lang="ts">
import vertextShader from "@/assets/shaders/scale.vs";
import fragmentSader from "@/assets/shaders/mondrian.fs";
import { onMounted, ref } from "vue";
import {
  Scene,
  Color,
  OrthographicCamera,
  WebGLRenderer,
  PlaneGeometry,
  Vector2,
  ShaderMaterial,
  Mesh,
  GLSL3,
} from "three";

const myfuckingscene = ref<HTMLCanvasElement>();

onMounted(() => {
  const canvas = myfuckingscene.value as HTMLCanvasElement;

  const context = canvas.getContext("webgl2")!;

  const scene = new Scene();
  scene.background = new Color(0xf0ead6);

  const { clientWidth: width, clientHeight: height } = canvas;

  const camera = new OrthographicCamera(
    width / -2,
    width / 2,
    height / 2,
    height / -2,
    0.1,
    2
  );
  camera.position.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  const renderer = new WebGLRenderer({ canvas, context });
  renderer.setPixelRatio(window.devicePixelRatio);

  const scaleFactor = 1.5;
  const planeGeometry = new PlaneGeometry(
    width * scaleFactor,
    height * scaleFactor
  );

  const resolution = new Vector2(0, 0);
  const uniforms = {
    u_time: {
      value: 0.0,
    },
    u_resolution: {
      value: resolution,
    },
  };

  const material = new ShaderMaterial({
    uniforms,
    vertexShader: vertextShader.trim(),
    fragmentShader: fragmentSader.trim(),
    glslVersion: GLSL3,
  });

  const plane = new Mesh(planeGeometry, material);
  scene.add(plane);

  interface AdjustViewArgs {
    camera: OrthographicCamera;
    renderer: WebGLRenderer;
    canvas: HTMLCanvasElement;
  }

  function adjustView({ camera, renderer, canvas }: AdjustViewArgs) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width || canvas.height !== height) {
      resolution.x = width * window.devicePixelRatio;
      resolution.y = height * window.devicePixelRatio;

      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);
    }
  }

  function animate(time: number): void {
    time = time * 0.001;
    uniforms.u_time.value = time;
    adjustView({ camera, renderer, canvas });
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});
</script>

<template>
  <canvas ref="myfuckingscene"></canvas>
  <p>Vertex Shader</p>
  <code>
    {{ vertextShader }}
  </code>
  <p>Fragment Shader</p>
  <code>
    {{ fragmentSader }}
  </code>
  <p>Result</p>
</template>

<style scoped lang="scss">
code {
  white-space: pre;
}

$canvas-max-width: 400px;

canvas {
  display: block;
  width: 100%;
  height: 600px;
  width: 450px;
}
</style>
