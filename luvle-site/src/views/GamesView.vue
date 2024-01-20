<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n({
  useScope: "local",
});
</script>

<script lang="ts">
import { initializeWebGL } from "./games/webgl";
import { initializeScene, addToScene, adjustView } from "./games/cube-up/scene";
import { Scene, PerspectiveCamera, Raycaster, Vector2 } from "three";
import { CubeState } from "./games/cube-up/cube";
import type { Cube, ShakeValues } from "./games/cube-up/cube";
import { createCubes } from "./games/cube-up/cubeFactory";
import { createTimerBar } from "./games/cube-up/timerBarFactory";
import { TimerBarAnimator } from "./games/cube-up/timerBarAnimator";

interface GameViewData {
  sceneId: string;
  canvas: HTMLCanvasElement;
  camera: PerspectiveCamera;
  raycaster: Raycaster;
  scene: Scene;
  mouse: Vector2;
  cubes: Cube[];
  timerBarAnimator: TimerBarAnimator;
  gameData: {
    shouldIdleBreathe: boolean;
    points: number;
    roundTimeInSeconds: number;
    currentRoundTime: number;
  };
}

export default {
  data(): GameViewData {
    return {
      sceneId: "scene",
      canvas: {} as HTMLCanvasElement,
      camera: {} as PerspectiveCamera,
      raycaster: new Raycaster(),
      mouse: new Vector2(),
      scene: {} as Scene,
      cubes: [],
      timerBarAnimator: {} as TimerBarAnimator,
      gameData: {
        shouldIdleBreathe: true,
        points: 0,
        roundTimeInSeconds: 5,
        currentRoundTime: Number.POSITIVE_INFINITY
      },
    };
  },
  mounted() {
    // Initialize Engine
    const { canvas, renderer } = initializeWebGL({
      id: "scene",
    });
    this.canvas = canvas;

    const { camera, scene } = initializeScene({
      canvas,
    });
    this.scene = scene;
    this.camera = camera;

    // Create and Add Objects to Scene
    const cubes: Cube[] = createCubes({
      rows: [3, 4, 3],
    });
    this.cubes = cubes;
    cubes.forEach((cube) => {
      addToScene(cube, scene);
    });

    const timerBar = createTimerBar({
      camera
    });
    addToScene(timerBar, scene);

    const timerBarAnimator = new TimerBarAnimator({
      timerBar,
      camera
    });
    this.timerBarAnimator = timerBarAnimator;
   
    // Interaction
    this.canvas.addEventListener("click", this.onCanvasClick);
    this.canvas.addEventListener("keydown", this.handleInput);

    // Render Loop
    const animate = (time: DOMHighResTimeStamp) => {
      cubes.forEach((cube) => {
        cube.breathingAnimation(time, this.gameData.shouldIdleBreathe);
        cube.shakingAnimation(time);
      });
      const countdownDone = timerBarAnimator.countdown(time);
      if (countdownDone) {
        this.loseAnimation();
        // triggerLose();
      }

      adjustView({ canvas, renderer, camera });
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    // Kick-Off Render Loop
    requestAnimationFrame(animate);
  },
  beforeUnmount() {
    this.canvas.removeEventListener("click", this.onCanvasClick);
    this.canvas.removeEventListener("keydown", this.handleInput);
  },
  methods: {
    onCanvasClick(event: MouseEvent) {
      if (this.gameData.shouldIdleBreathe) {
        this.timerBarAnimator.startCountDown(this.gameData.roundTimeInSeconds, performance.now());
      }
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

      const normalizedX =
        (canvasRelativeX / canvasWidth) * lengthOfNDCSquare - ndcUnit;
      const normalizedY =
        inversion * (canvasRelativeY / canvasHeight) * lengthOfNDCSquare +
        ndcUnit;

      // set Coordinates
      this.mouse.x = normalizedX;
      this.mouse.y = normalizedY;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      const intersects = this.raycaster.intersectObjects(
        this.scene.children,
        false
      );

      if (intersects.length > 0) {
        const intersected = intersects[0].object;
        const cube: Cube = intersected.userData.cube;

        switch (cube.state) {
          case CubeState.DONT_PRESS:
            this.loseAnimation();
            break;
          case CubeState.SHOULD_PRESS:
            this.addPoints();
          case CubeState.PRESSED:
          case CubeState.NOT_PRESSED:
            cube.pressed();
            break;
        }
      }
    },
    handleInput({ key }: KeyboardEvent) {
      const Keys = {
        Space: " ",
      };

      switch (key) {
        case Keys.Space:
          if (this.didWin) {
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
      this.timerBarAnimator.reset();
      this.cubes.forEach((cube) => {
        cube.reset();
      });
      this.gameData.shouldIdleBreathe = true;
    },
    animateRoundEnd(values: ShakeValues, animation: () => void) {
      this.canvas.removeEventListener("click", this.onCanvasClick);
      this.canvas.removeEventListener("keydown", this.handleInput);

      this.timerBarAnimator.pause();
      this.cubes.forEach((cube) => {
        cube.unpress();
        cube.setShakeValues(values);
      });

      const flashInterval = setInterval(animation, 250);

      setTimeout(() => {
        clearInterval(flashInterval);
        this.initCubes();
        this.canvas.addEventListener("click", this.onCanvasClick);
        this.canvas.addEventListener("keydown", this.handleInput);
      }, values.shakingDurationInMillis);
    },
    loseAnimation() {
      this.animateRoundEnd(
        {
          shakingDurationInMillis: 1500,
          shakeIntensity: 0.05,
          shakeScaleIncrease: 1,
        },
        () => {
          this.cubes.forEach((cube) => {
            cube.toggleLose();
          });
        }
      );
    },
    winAnimation() {
      this.animateRoundEnd(
        {
          shakingDurationInMillis: 1500,
          shakeIntensity: 0.05,
          shakeScaleIncrease: 1,
        },
        () => {
          this.cubes.forEach((cube) => {
            cube.toggleWin();
          });
        }
      );
    },
  },
  computed: {
    didWin(): boolean {
      const noMoreCubesThatWeNeedToPress =
        this.cubes.filter((cube) => cube.state === CubeState.SHOULD_PRESS)
          .length === 0;
      return noMoreCubesThatWeNeedToPress;
    },
  },
};
</script>

<template>
  <div class="games">
    <h1>{{ t("title") }}</h1>
    <div class="canvas-container">
      <canvas :id="sceneId" tabindex="0"></canvas>
    </div>
  </div>
</template>

<style scoped lang="scss">
div.canvas-container {
  max-height: 720px;
  max-width: 1280px;
  aspect-ratio: 16 / 9;
  width: 100%;
  height: auto;
  margin: auto;

  canvas {
    width: 100%;
    height: 100%;
    outline: none;
  }
}
</style>

<i18n lang="json">
{
  "en": {
    "title": "Games"
  },
  "es": {
    "title": "Juegos"
  },
  "ca": {
    "title": "Jocs"
  }
}
</i18n>
./games/webgl