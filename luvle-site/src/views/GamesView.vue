<script lang="ts">
import { isSomething } from "@luvle/utils";
import type { Maybe } from "@luvle/utils";
import {
  AmbientLight,
  DirectionalLight,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshStandardMaterial,
  Mesh,
  Color,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial,
  PointLight,
  PCFSoftShadowMap,
  Raycaster,
  Vector2
} from 'three';
import { times } from "underscore";

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

// Helper Functions
function adjustView({ canvas, renderer, camera }: AdjustViewArgs) {
  camera.updateMatrixWorld();

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width !== canvas.width || height !== canvas.height) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }
}

function getRandomIntInclusive(lower: number, upper: number): number {
  const min = Math.ceil(lower);
  const max = Math.floor(upper);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCubeState(value: number): CubeState {
  switch (value) {
    case 1:
      return CubeState.NOT_PRESSED;
    case 2:
      return CubeState.SHOULD_PRESS;
    case 3:
      return CubeState.DONT_PRESS;
    default:
      throw new Error('Invalid value: Expected a number between 1 and 3');
  }
}

enum CubeState {
  NOT_PRESSED = 0x0099ff,
  SHOULD_PRESS = 0x66ff66,
  DONT_PRESS = 0xff6666,
  PRESSED = 0xefefef,
}

const sceneId = "scene";

interface GameViewData {
  canvas: HTMLCanvasElement;
  camera: PerspectiveCamera;
  raycaster: Raycaster;
  scene: Scene;
  mouse: Vector2;
  cubes: Mesh[];
  lastAcceleration: { x: number | null, y: number | null, z: number | null };
  gameData: {
    shouldIdleBreathe: boolean;
    points: number;
  }
}

let rattlingDuration = 150; // In Milliis
let rattleIntensity = 0.1;
let scaleIncrease = 1.2; // Maximum scale increase

function rattleAnimation(time: DOMHighResTimeStamp, cube: Mesh) {
  if (cube.userData.pressedAt == 0) return;
  const startTime = cube.userData.pressedAt;

  const elapsedTime = time - startTime;
  if (elapsedTime > rattlingDuration) {
    // Stop the animation after the duration has passed
    cube.userData.pressedAt == 0
    const { x, y, z } = cube.userData.position;
    cube.position.set(x, y, z);
    cube.scale.set(1, 1, 1); // Reset scale after animation
    return;
  }

  // Rattle effect - Slightly randomize position
  cube.position.x += (Math.random() - 0.5) * rattleIntensity;
  cube.position.y += (Math.random() - 0.5) * rattleIntensity;
  cube.position.z += (Math.random() - 0.5) * rattleIntensity;

  // Grow effect - Gradually increase scale
  const progress = elapsedTime / rattlingDuration;
  const scale = 1 + progress * (scaleIncrease - 1); // Linearly interpolate scale
  cube.scale.set(scale, scale, scale);
}

export default {
  data(): GameViewData {
    return {
      canvas: {} as HTMLCanvasElement,
      camera: {} as PerspectiveCamera,
      raycaster: new Raycaster(),
      mouse: new Vector2(),
      scene: {} as Scene,
      cubes: [],
      lastAcceleration: { x: null, y: null, z: null },
      gameData: {
        shouldIdleBreathe: true,
        points: 0
      }
    };
  },
  mounted() {
    this.canvas = document.getElementById(sceneId) as HTMLCanvasElement;
    isSomethingOrThrow({
      maybe: this.canvas,
      error: `Canvas element ${sceneId} not found`
    });
    const canvas = this.canvas;

    const context = canvas.getContext('webgl2')!;
    isSomethingOrThrow({
      maybe: context,
      error: "WebGL2 context could not be created"
    });

    const renderer = new WebGLRenderer({ context, canvas });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    // Add Shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new Scene();
    this.scene = scene;
    scene.background = new Color(0xf0f0f0);

    // Camera
    const cameraFOV = 75;
    const cameraAspect = canvas.clientWidth / canvas.clientHeight;
    const cameraNearClipping = 0.1;
    const cameraFarClipping = 100;
    const camera = new PerspectiveCamera(
      cameraFOV,
      cameraAspect,
      cameraNearClipping,
      cameraFarClipping
    );
    this.camera = camera;

    // Constants for the setup
    const angle = 70; // angle in degrees
    const radians = (angle / 180) * Math.PI; // convert angle to radians
    const distance = 4; // how far the camera should be from the point it's looking at

    const x = 0;
    const y = distance * Math.sin(radians);
    const z = distance * Math.cos(radians);

    // Look from above looking down
    camera.position.set(x, y, z);
    camera.lookAt(scene.position); // Pointing the camera toward the center of the scene
    camera.updateProjectionMatrix();

    // Lighting 
    const ambientLight = new AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    const geometry = new BoxGeometry(1, 1, 1);

    // Create Cubes
    const cubes: Mesh[] = [];
    this.cubes = cubes;
    const rows = [3, 4, 3];

    const offset = Math.max(...rows) / 2 - 0.5; // Centering offset for the cubes
    const cubeSize = geometry.parameters.width;
    const cubeGap = 0.2;
    const cubeSpacing = (cubeSize + cubeGap);

    rows.forEach((numCubes, rowIndex) => {
      for (let i = 0; i < numCubes; i++) {

        const cubeState = getCubeState(getRandomIntInclusive(1, 3));
        const material = new MeshStandardMaterial({ color: cubeState });
        const cube = new Mesh(geometry, material.clone());

        // Position of the Cubes
        const positionX = i * cubeSpacing - ((numCubes - 1) * cubeSpacing) / 2;
        const positionZ = rowIndex * cubeSpacing - (rows.length - 1) * cubeSpacing / 2; // offset for z to center the rows

        cube.position.set(positionX, 0, positionZ);

        // Add some Jitter
        // Random rotation
        cube.rotation.x = Math.random() * 0.2 - 0.1; // Slight rotation about X-axis
        cube.rotation.y = Math.random() * 0.2 - 0.1; // Slight rotation about Y-axis

        // Random position offset
        cube.position.x += Math.random() * 0.2 - 0.1;
        cube.position.z += Math.random() * 0.2 - 0.1;

        // Allow Shadows
        cube.receiveShadow = true;
        cube.castShadow = true;

        // Add some Edges
        const edges = new EdgesGeometry(geometry);
        const line = new LineSegments(edges, new LineBasicMaterial({ color: 0xffffff }));
        cube.add(line); // Add the edges as a child of the cube

        cube.userData = {
          breathingFrequency: getRandomIntInclusive(1, 5) / 3200,
          position: {
            x: positionX,
            y: 0,
            z: positionZ
          },
          cubeState,
          pressedAt: 0
        };

        // Add to our List
        cubes.push(cube);
      }
    });

    cubes.forEach(cube => {
      scene.add(cube);
    });


    // Interaction
    this.canvas.addEventListener('click', this.onCanvasClick);
    this.canvas.addEventListener('keydown', this.handleInput);

    const gameData = this.gameData;

    function animate(time: DOMHighResTimeStamp) {
      // Animations
      if (gameData.shouldIdleBreathe) {
        // levitating
        cubes.forEach((cube) => {
          cube.position.y = 0.2 * Math.sin(time * cube.userData.breathingFrequency);
        });
      } else {
        // Snap down
        cubes.forEach((cube) => {
          cube.position.y = 0;
        });
      }
      cubes.forEach(cube => rattleAnimation(time, cube));

      adjustView({ canvas, renderer, camera });
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  },
  beforeUnmount() {
    this.canvas.removeEventListener('click', this.onCanvasClick);
  },
  methods: {
    onCanvasClick(event: MouseEvent) {
      this.gameData.shouldIdleBreathe = false;
      const rect = this.canvas.getBoundingClientRect();

      // Position relative to canvas
      const canvasRelativeX = event.clientX - rect.left;
      const canvasRelativeY = event.clientY - rect.top;
      const canvasWidth = rect.width;
      const canvasHeight = rect.height;

      // Normalize
      // Normalized Device Coordinates [-1,1]
      const ndcUnit = 1;
      const lengthOfNDCSquare = 2; // length from -1 to 1
      const inversion = -1;

      const normalizedX = (canvasRelativeX / canvasWidth) * lengthOfNDCSquare - ndcUnit;
      const normalizedY = inversion * (canvasRelativeY / canvasHeight) * lengthOfNDCSquare + ndcUnit;

      // set Coordinates
      this.mouse.x = normalizedX;
      this.mouse.y = normalizedY;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      const intersects = this.raycaster.intersectObjects(this.scene.children, false);

      if (intersects.length > 0) {
        const intersected = intersects[0].object;
        const cubeState = intersected.userData.cubeState;

        switch (cubeState) {
          case CubeState.DONT_PRESS:
            this.loseAnimation();
            break;
          case CubeState.SHOULD_PRESS:
            intersected.userData.cubeState = CubeState.PRESSED;
            this.addPoints();
          case CubeState.PRESSED:
          case CubeState.NOT_PRESSED:
            intersected.userData.pressedAt = performance.now();
            if (intersected instanceof Mesh) {
              intersected.material.color.set(CubeState.PRESSED);
            }
            break;
        }
      }
    },
    handleInput({ key }: KeyboardEvent) {
      const Keys = {
        Space: ' '
      };

      switch (key) {
        case Keys.Space:
          const didWin = this.cubes.filter((cube) => cube.userData.cubeState === CubeState.SHOULD_PRESS).length === 0;
          if (didWin) {
            this.winAnimation();
          } else {
            this.loseAnimation();
          }
          break;
      }
    },
    addPoints() {
      this.gameData.points += 50;
    },
    initCubes() {
      this.cubes.forEach((cube) => {
        const cubeState = getCubeState(getRandomIntInclusive(1, 3));
        // Re-Do the color of the
        if ('color' in cube.material) {
          (cube.material as MeshStandardMaterial).color.set(cubeState);
        }
        // Re-Do the position of the cubes
        const { x, y, z } = cube.userData.position;
        cube.position.set(x, y, z);
        // Add some Jitter
        // Random rotation
        cube.rotation.x = Math.random() * 0.2 - 0.1; // Slight rotation about X-axis
        cube.rotation.y = Math.random() * 0.2 - 0.1; // Slight rotation about Y-axis

        // Random position offset
        cube.position.x += Math.random() * 0.2 - 0.1;
        cube.position.z += Math.random() * 0.2 - 0.1;

        cube.userData.cubeState = cubeState;

      });
      this.gameData.shouldIdleBreathe = true;
    },
    loseAnimation() {
      const animationDuration = 1500;
      rattlingDuration = animationDuration;
      rattleIntensity = 0.05;
      scaleIncrease = 1;

      this.canvas.removeEventListener('click', this.onCanvasClick);
      this.canvas.removeEventListener('keydown', this.handleInput);

      this.gameData.points = 0;
      // Set all cubes to not pressed
      this.cubes.forEach((cube) => {
        cube.userData.pressedAt = performance.now();
        if ('color' in cube.material) {
          (cube.material as MeshStandardMaterial).color.set(CubeState.NOT_PRESSED);
        }
      });

      // Start flashing
      const flashInterval = setInterval(() => {

        this.cubes.forEach((cube) => {
          if ('color' in cube.material) {
            // Toggle between red and bright red
            const newColor = (cube.material as MeshStandardMaterial).color.getHex() === CubeState.DONT_PRESS ? CubeState.NOT_PRESSED : CubeState.DONT_PRESS;
            (cube.material as MeshStandardMaterial).color.set(newColor);
          }
        });
      }, 250); // Flash every 250 milliseconds

      // Stop flashing after 2 seconds and reset colors
      setTimeout(() => {
        clearInterval(flashInterval);
        // Once the animation is done, re-initialize the cubes
        this.initCubes();
        this.canvas.addEventListener('click', this.onCanvasClick);
        this.canvas.addEventListener('keydown', this.handleInput);
        rattlingDuration = 150;
        rattleIntensity = 0.1;
        scaleIncrease = 1.2;

      }, animationDuration); // Run the flashing for 2 seconds
    },
    winAnimation() {
      const animationDuration = 1500;
      rattlingDuration = animationDuration;
      rattleIntensity = 0.05;
      scaleIncrease = 1;

      this.canvas.removeEventListener('click', this.onCanvasClick);
      this.canvas.removeEventListener('keydown', this.handleInput);

      this.cubes.forEach((cube) => {
        cube.userData.pressedAt = performance.now();

        if ('color' in cube.material) {
          (cube.material as MeshStandardMaterial).color.set(CubeState.NOT_PRESSED);
        }
      });

      // Start flashing
      const flashInterval = setInterval(() => {

        this.cubes.forEach((cube) => {
          if ('color' in cube.material) {
            // Toggle between red and bright red
            const newColor = (cube.material as MeshStandardMaterial).color.getHex() === CubeState.SHOULD_PRESS ? CubeState.NOT_PRESSED : CubeState.SHOULD_PRESS;
            (cube.material as MeshStandardMaterial).color.set(newColor);
          }
        });
      }, 250); // Flash every 250 milliseconds

      // Stop flashing after 2 seconds and reset colors
      setTimeout(() => {
        clearInterval(flashInterval);
        // Once the animation is done, re-initialize the cubes
        this.initCubes();
        this.canvas.addEventListener('click', this.onCanvasClick);
        this.canvas.addEventListener('keydown', this.handleInput);
        rattlingDuration = 150;
        rattleIntensity = 0.1;
        scaleIncrease = 1.2;

      }, animationDuration); // Run the flashing for 2 seconds 
    },
  }
}
</script>

<template>
  <div class="games">
    <h1>Games</h1>
    <canvas id="scene" tabindex="0"></canvas>
  </div>
</template>

<style scoped lang="scss">
div.games {
  max-height: 720px;
  max-width: 1280px;
  aspect-ratio: 16 / 9;
  width: 100%;
  height: auto;
  margin: auto;
}

canvas#scene {
  width: 100%;
  height: 100%;
  outline: none;
}
</style>
