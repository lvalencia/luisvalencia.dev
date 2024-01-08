<script lang="ts">
import { isSomething } from "@luvle/utils";
import type { Maybe } from "@luvle/utils";
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, Color } from 'three';

interface IsSomethingOrThrowArgs<T> {
  maybe: Maybe<T>;
  error: string;
}

function isSomethingOrThrow<T>({ maybe, error }: IsSomethingOrThrowArgs<T>): void {
  if (!isSomething(maybe)) {
    throw new Error(error);
  }
}

interface AdjustViewArgs {
  canvas: HTMLCanvasElement;
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;

}

function adjustView({ canvas, renderer, camera }: AdjustViewArgs) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width !== canvas.width || height !== canvas.height) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }
}

const sceneId = "scene";

export default {
  mounted() {
    const canvas = document.getElementById(sceneId) as HTMLCanvasElement;
    isSomethingOrThrow({
      maybe: canvas,
      error: `Canvas element ${sceneId} not found`
    });

    const context = canvas.getContext('webgl2')!;
    isSomethingOrThrow({
      maybe: context,
      error: "WebGL2 context could not be created"
    });

    const renderer = new WebGLRenderer({ context, canvas });
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    const scene = new Scene();
    scene.background = new Color(0x000000);
    const cameraFOV = 75;
    const cameraAspect = window.innerWidth / window.innerHeight;
    const cameraNearClipping = 0.1;
    const cameraFarClipping = 100;
    const camera = new PerspectiveCamera(
      cameraFOV,
      cameraAspect,
      cameraNearClipping,
      cameraFarClipping
    );
    camera.position.set(0, 0, 75);
    camera.lookAt(0, 0, 0);

    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function animate() {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      adjustView({ canvas, renderer, camera });
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();
  }
}
</script>

<template>
  <div class="games">
    <h1>Games</h1>
    <canvas id="scene"></canvas>
  </div>
</template>

<style scoped lang="scss">
canvas#scene {
  height: 720px;
  width: 1280px;
}
</style>
