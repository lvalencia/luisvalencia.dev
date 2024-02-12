<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n({
  useScope: "local",
});
</script>

<script lang="ts">
import { initializeWebGL } from "./shared/webgl";
import { initializeScene, addToScene, adjustView } from "./cube-up/scene";
import { Scene, PerspectiveCamera, Raycaster, Vector2 } from "three";
import { CubeState, isCube } from "./cube-up/cube";
import { SoundBoard } from "./cube-up/soundboard";
import { createCubes } from "./cube-up/cubeFactory";
import { createTimerBar } from "./cube-up/timerBarFactory";
import { TimerBarAnimator } from "./cube-up/timerBarAnimator";
import { addPoints, renderNextTick } from "./cube-up/scoreBoardAnimator";
import { createScoreBoard } from "./cube-up/scoreBoardFactory";
import { createSubmitButton } from "./cube-up/submitButtonFactory";
import { isSubmitButton } from "./cube-up/submitButton";
import { SubmitButtonAnimator } from "./cube-up/submitButtonAnimator";
import { stringIsSomething, fromNullable } from "@luvle/utils";
import { LevelCard } from "./cube-up/levelCard";
import { LevelCardAnimator } from "./cube-up/levelCardAnimator";
import { isSoundIcon, SoundIcon } from "./cube-up/soundIcon";
import { CubeAnimator, toggleLose, toggleWin } from "./cube-up/cubeAnimator";
import type { ShakeValues } from "./cube-up/cubeAnimator";
import type { SubmitButton } from "./cube-up/submitButton";
import type { Cube } from "./cube-up/cube";
import type { ScoreBoard } from "./cube-up/scoreBoard";
import type { LevelContent } from "./cube-up/levelCard";
import type { Maybe, Nullable } from "@luvle/utils";
import type { Object3DEventMap, Object3D } from "three";

interface LevelConfiguration {
  content: LevelContent;
  roundTimeInSeconds: number;
  numberOfRounds: number;
}

interface GameViewData {
  sceneId: string;
  canvas: HTMLCanvasElement;
  camera: PerspectiveCamera;
  raycaster: Raycaster;
  scene: Scene;
  mouse: Vector2;
  cubes: Cube[];
  cubeAnimator: CubeAnimator;
  timerBarAnimator: TimerBarAnimator;
  scoreBoard: ScoreBoard;
  soundBoard: SoundBoard;
  highScore: ScoreBoard;
  submitButton: SubmitButton;
  levelCard: LevelCard;
  levelCardAnimator: LevelCardAnimator;
  intersectable: Object3D<Object3DEventMap>[];
  levels: LevelConfiguration[];
  game: {
    currentRound: number;
    currentLevel: number;
    roundIsActive: boolean;
  };
}

const SAVED_HIGH_SCORE_KEY = "saved_high_score";

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
      cubeAnimator: {} as CubeAnimator,
      timerBarAnimator: {} as TimerBarAnimator,
      scoreBoard: {} as ScoreBoard,
      soundBoard: {} as SoundBoard,
      highScore: {} as ScoreBoard,
      submitButton: {} as SubmitButton,
      levelCard: {} as LevelCard,
      levelCardAnimator: {} as LevelCardAnimator,
      intersectable: [],
      levels: [
        {
          content: {
            title: "Level 1",
            instructions: "Hit all the greens!",
          },
          roundTimeInSeconds: 5,
          numberOfRounds: 5,
        },
        {
          content: {
            title: "Level 2",
            instructions: "Beware the Changing Cubes!",
          },
          roundTimeInSeconds: 5,
          numberOfRounds: 5,
        },
        {
          content: {
            title: "Level 3",
            instructions: "Run away!"
          },
          roundTimeInSeconds: 5,
          numberOfRounds: 5,
        },
        {
          content: {
            title: "Level 4",
            instructions: "Scramble!"
          },
          roundTimeInSeconds: 5,
          numberOfRounds: 5,
        },
        {
          content: {
            title: "Level 5",
            instructions: "This is heavy doc!",
          },
          roundTimeInSeconds: 5,
          numberOfRounds: 5,
        },
        {
          content: {
            title: "Level 6",
            instructions: "Faster, Faster!",
          },
          roundTimeInSeconds: 2.5,
          numberOfRounds: 5
        },
        {
          content: {
            title: "Level 7",
            instructions: "Chaos",
          },
          roundTimeInSeconds: 2.5,
          numberOfRounds: Number.POSITIVE_INFINITY
        },
      ],
      game: {
        currentRound: 0,
        currentLevel: 0,
        roundIsActive: false,
      },
    };
  },
  mounted() {
    this.enlargeMaxPageWidth();

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
    this.intersectable.push(
      ...this.cubes.map((cube) => cube.getRepresentation())
    );

    const cubeAnimator = new CubeAnimator();
    this.cubeAnimator = cubeAnimator;

    const timerBar = createTimerBar({
      camera
    });
    addToScene(timerBar, scene);

    const timerBarAnimator = new TimerBarAnimator({
      timerBar,
      camera
    });
    this.timerBarAnimator = timerBarAnimator;

    const scoreBoard = createScoreBoard({
      text: 'Score',
      camera,
      color: 0x9966FF,
    });
    this.scoreBoard = scoreBoard;
    addToScene(scoreBoard, scene);

    const highScore = createScoreBoard({
      text: 'High Score',
      camera,
      color: 0x9966FF,
      position: {
        x: 0.2,
        y: 3,
        z: 0.2,
      },
      initialScore: this.savedHighScore
    });
    this.highScore = highScore;
    addToScene(highScore, scene);

    const submitButton = createSubmitButton({
      initialColor: this.noMoreCubesThatWeNeedToPress ? CubeState.SHOULD_PRESS : CubeState.DONT_PRESS,
      onPressed: () => {
        this.handleInput({ key: " " } as KeyboardEvent)
      }
    });
    this.submitButton = submitButton;
    addToScene(submitButton, scene)
    this.intersectable.push(submitButton.getRepresentation());

    const submitButtonAnimator = new SubmitButtonAnimator({
      submitButton,
      cubeAnimator
    });

    this.soundBoard = new SoundBoard();

    const levelCard = new LevelCard({
      color: 0xffffff,
    });
    this.levelCard = levelCard;
    addToScene(levelCard, scene);
    const levelCardAnimator = new LevelCardAnimator({
      levelCard,
    });
    this.levelCardAnimator = levelCardAnimator;
    levelCardAnimator.updateContentAndShow(this.currentLevelContent);
    this.soundBoard.startWind();

    const soundIcon = new SoundIcon();
    this.intersectable.push(soundIcon.getRepresentation());
    addToScene(soundIcon, scene);

    // Interaction
    this.canvas.addEventListener("click", this.onCanvasClick);
    this.canvas.addEventListener("keydown", this.handleInput);

    // Render Loop
    const animate = (time: DOMHighResTimeStamp) => {
      cubes.forEach((cube) => {
        const animationsArgs = {
          cube,
          time,
        }

        cubeAnimator.breathing({
          ...animationsArgs,
          shouldBreathe: this.shouldIdleBreathe,
        })
        cubeAnimator.shaking({
          ...animationsArgs
        });
      });

      if (this.noMoreCubesThatWeNeedToPress) {
        this.submitButton.indicateShouldPress();
      }

      const countdownDone = timerBarAnimator.countdown(time);
      if (countdownDone) {
        this.loseAnimation();
      }
      submitButtonAnimator.update(time);

      adjustView({ canvas, renderer, camera });
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    // Kick-Off Render Loop
    requestAnimationFrame(animate);
  },
  beforeUnmount() {
    this.resetMaxPageWidth();

    this.canvas.removeEventListener("click", this.onCanvasClick);
    this.canvas.removeEventListener("keydown", this.handleInput);
    this.soundBoard.stop();
    this.soundBoard.silenced = true;
  },
  methods: {
    onCanvasClick(event: MouseEvent) {
      const haventStartedLevel = !this.game.roundIsActive;
      const intersected = this.getIntersectedObject(event);

      if (isSoundIcon(intersected)) {
        const soundIcon = intersected;
        soundIcon.toggle();
        this.toggleSilenced();

        if (haventStartedLevel) return;
      }

      if (haventStartedLevel) {
        this.levelCard.hide();
        this.soundBoard.stopWind();
        this.soundBoard.startLevelBackground();
        this.game.roundIsActive = true;
        this.startCountDown();

        return;
      }

      if (isCube(intersected)) {
        const cube = intersected;
        switch (cube.state) {
          case CubeState.DONT_PRESS:
            this.loseAnimation();
            break;
          case CubeState.SHOULD_PRESS:
            this.soundBoard.points();
            this.addPoints();
            cube.pressed();
            break;
          case CubeState.PRESSED:
          case CubeState.NOT_PRESSED:
            this.soundBoard.noPoints();
            cube.pressed();
            break;
        }
      }

      if (isSubmitButton(intersected)) {
        const submitButton = intersected;
        submitButton.pressed();
      }
    },
    getIntersectedObject(event: MouseEvent): Maybe<Cube | SubmitButton | SoundIcon> {
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
        this.intersectable,
        false
      );
      if (intersects.length > 0) {
        return intersects[0].object.userData.object;
      }
      return undefined;
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
    animateLevelEnd(values: ShakeValues, animation: () => void, endActions: () => void = () => { }) {
      this.endRound();

      this.canvas.removeEventListener("click", this.onCanvasClick);
      this.canvas.removeEventListener("keydown", this.handleInput);

      this.timerBarAnimator.pause();
      this.cubeAnimator.setShakeValues(values);
      this.cubes.forEach((cube) => {
        cube.unpress();
      });

      const flashInterval = setInterval(animation, 250);

      setTimeout(() => {
        clearInterval(flashInterval);
        this.prepNextRound();
        this.canvas.addEventListener("click", this.onCanvasClick);
        this.canvas.addEventListener("keydown", this.handleInput);
        endActions();
      }, values.shakingDurationInMillis);
    },
    loseAnimation() {
      this.soundBoard.lost();

      this.animateLevelEnd(
        {
          shakingDurationInMillis: 1500,
          shakeIntensity: 0.05,
          shakeScaleIncrease: 1,
        },
        () => {
          this.cubes.forEach((cube) => {
            toggleLose(cube as Cube);
          });
        },
        () => {
          this.resetGame();
        }
      );
    },
    winAnimation() {
      this.soundBoard.win();

      this.animateLevelEnd(
        {
          shakingDurationInMillis: 1500,
          shakeIntensity: 0.05,
          shakeScaleIncrease: 1,
        },
        () => {
          this.cubes.forEach((cube) => {
            toggleWin(cube as Cube)
          });
        },
      );
    },
    addPoints() {
      addPoints(this.sessionScoreBoard, 50);
      this.updateHighScore();
    },
    prepNextRound() {
      this.timerBarAnimator.reset();
      this.cubes.forEach((cube) => {
        cube.reset();
      });
      this.cubeAnimator.reset();

      if (this.levelIsOver) {
        this.prepNextLevel();
      } else {
        this.game.roundIsActive = true;
        this.startCountDown();
      }

      this.submitButton.indicateShouldNotPress();
      this.updateHighScore();
    },
    endRound(): void {
      this.game.roundIsActive = false;
      this.game.currentRound += 1;
    },
    prepNextLevel() {
      this.game.currentRound = 0;
      this.game.currentLevel += 1;
      this.soundBoard.stopLevelBackground();
      this.displayNextLevelCard();
      this.soundBoard.startWind();
    },
    displayNextLevelCard() {
      this.levelCardAnimator.updateContentAndShow(this.currentLevelContent);
    },
    startCountDown() {
      this.timerBarAnimator.startCountDown(this.currentRoundTimeInSeconds, performance.now());
    },
    resetGame() {
      this.game.roundIsActive = false;
      this.scoreBoard.scoreCount = 0;
      this.game.currentRound = 0;
      this.game.currentLevel = 0;
      this.timerBarAnimator.pause();
      this.timerBarAnimator.reset();
      this.displayNextLevelCard();
      this.soundBoard.stopLevelBackground();
      this.soundBoard.startWind();
      renderNextTick(this.sessionScoreBoard);
    },
    updateHighScore() {
      const roundScore = this.scoreBoard.scoreCount;
      const highScore = this.highScore.scoreCount;

      if (roundScore > highScore) {
        this.highScore.scoreCount = roundScore;
        localStorage.setItem(SAVED_HIGH_SCORE_KEY, String(roundScore));
        renderNextTick(this.highScoreBoard);
      }
    },
    toggleSilenced() {
      this.soundBoard.silenced = !this.soundBoard.silenced;
    },
    enlargeMaxPageWidth() {
      this.container.classList.add('large');
    },
    resetMaxPageWidth() {
      this.container.classList.remove('large');
    },
    makeFullScreen() {
      if (this.canvas.requestFullscreen) {
        this.canvas.requestFullscreen();
        return;
      }

      const altCanvasAPI = this.canvas as any;

      if (altCanvasAPI.webkitRequestFullScreen) {
        altCanvasAPI.webkitRequestFullScreen();
        return;
      }
      if (altCanvasAPI.mozRequestFullScreen) {
        altCanvasAPI.mozRequestFullScreen();
        return;
      }
      if (altCanvasAPI.msRequestFullscreen) {
        altCanvasAPI.msRequestFullscreen();
        return;
      }
    },
    exitFullScreen() {
      const altCanvasAPI = this.canvas as any;

      if (altCanvasAPI.exitFullscreen) {
        altCanvasAPI.exitFullscreen();
        return;
      }

      if (altCanvasAPI.webkitCancelFullScreen) {
        altCanvasAPI.webkitCancelFullScreen();
        return;
      }
      if (altCanvasAPI.mozCancelFullScreen) {
        altCanvasAPI.mozCancelFullScreen();
        return;
      }
      if (altCanvasAPI.msExitFullscreen) {
        altCanvasAPI.msExitFullscreen();
        return;
      }
    }
  },
  computed: {
    didWin(): boolean {
      return this.noMoreCubesThatWeNeedToPress;
    },
    noMoreCubesThatWeNeedToPress(): boolean {
      const noMoreCubesThatWeNeedToPress =
        this.cubes.filter((cube) => cube.state === CubeState.SHOULD_PRESS)
          .length === 0;
      return noMoreCubesThatWeNeedToPress && this.canInteract;
    },
    sessionScoreBoard(): ScoreBoard {
      return this.scoreBoard as ScoreBoard;
    },
    highScoreBoard(): ScoreBoard {
      return this.highScore as ScoreBoard;
    },
    savedHighScore(): number {
      const score = fromNullable({
        nullable: localStorage.getItem(SAVED_HIGH_SCORE_KEY),
        fallback: ""
      });

      if (stringIsSomething(score)) {
        return Number(score);
      }

      return 0;
    },
    canInteract(): boolean {
      return this.game.roundIsActive;
    },
    shouldIdleBreathe(): boolean {
      return !this.game.roundIsActive;
    },
    currentLevelContent(): LevelContent {
      return this.levels[this.game.currentLevel].content;
    },
    currentRoundTimeInSeconds(): number {
      return this.levels[this.game.currentLevel].roundTimeInSeconds;
    },
    numberOfRoundsInCurrentLevel(): number {
      return this.levels[this.game.currentLevel].numberOfRounds;
    },
    levelIsOver(): boolean {
      return this.game.currentRound >= this.numberOfRoundsInCurrentLevel;
    },
    container(): Element {
      const element: Nullable<Element> = document.querySelector('#app > div.grid-container');

      return fromNullable({
        nullable: element,
        fallback: document.createElement('null')
      });
    }
  },
};

</script>

<template>
  <div class="games">
    <h1>{{ t("title") }}</h1>
    <h2>{{ t("game") }}</h2>
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
  position: relative;

  .volume-icon {
    position: absolute;
    bottom: 3.2vh;
    left: 2vw;
    font-size: 240%;
    color: #9966FF;
    z-index: 10;
  }

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
    "title": "Game",
    "game": "Cube Up!"
  },
  "es": {
    "title": "Juego",
    "game": "Cube Up!"
  },
  "ca": {
    "title": "Joc",
    "game": "Cube Up!"
  }
}
</i18n>