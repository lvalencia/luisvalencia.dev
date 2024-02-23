<script lang="ts">
import { nextTick } from "vue";
import { useI18n } from "vue-i18n";
import Enlarger from "@/components/stylers/Enlarger.vue";
import { exitFullScreen, makeFullScreen } from "@/helpers/fullScreen";
import { initializeWebGL } from "./shared/webgl";
import { initializeScene, addToScene, adjustView } from "./cube-up/scene";
import { Scene, PerspectiveCamera, Raycaster, Vector2 } from "three";
import { CubeState, isCube } from "./cube-up/cube";
import { SoundBoard } from "./cube-up/soundboard";
import { createCubes } from "./cube-up/cubeFactory";
import { createTimerBar } from "./cube-up/timerBarFactory";
import { TimerBarAnimator } from "./cube-up/timerBarAnimator";
import { addPoints, renderNextTick } from "./cube-up/scoreboardAnimator";
import { createScoreboard } from "./cube-up/scoreboardFactory";
import { createSubmitButton } from "./cube-up/submitButtonFactory";
import { isSubmitButton } from "./cube-up/submitButton";
import { SubmitButtonAnimator } from "./cube-up/submitButtonAnimator";
import { stringIsSomething, fromNullable, removeIfFound } from "@luvle/utils";
import { LevelCard } from "./cube-up/levelCard";
import { LevelCardAnimator } from "./cube-up/levelCardAnimator";
import { isSoundIcon, SoundIcon } from "./cube-up/soundIcon";
import { CubeAnimator, toggleLose, toggleWin } from "./cube-up/cubeAnimator";
import { FullscreenIcon, isFullscreenIcon } from "./cube-up/fullscreenIcon";
import { InteractionResult, interactionResult } from "./cube-up/cubeInteractor";
import { selectRandomFrom, popRandomFrom, getRandomIntInclusive } from "@/helpers/random";
import { isEmpty } from "underscore";
import { CameraAnimator } from "./cube-up/cameraAnimator";
import { RandomWalker } from "./cube-up/randomWalker";
import type { ShakeValues } from "./cube-up/cubeAnimator";
import type { SubmitButton } from "./cube-up/submitButton";
import type { Cube } from "./cube-up/cube";
import type { Scoreboard } from "./cube-up/scoreboard";
import type { LevelContent } from "./cube-up/levelCard";
import type { Maybe } from "@luvle/utils";
import type { Object3DEventMap, Object3D } from "three";
import type { ToggleableIcon } from "./cube-up/toggleableIcon";

enum GameBehavior {
  SELECT_GREENS = 1,
  CHANGE_RANDOM = 2,
  SELECT_BLUES = 4,
  LAST_ONE_RUNS = 8,
  CHANGE_COLORS_ON_TOUCH = 16,
  FAKE_OUT = 32,
  ALL_RUN = 64,
  CUBES_ARE_HEAVY = 128,
}

interface LevelConfiguration {
  content: LevelContent;
  roundTimeInSeconds: number;
  numberOfRounds: number;
  behaviors: GameBehavior[];
}

interface GameViewData {
  sceneId: string;
  canvas: HTMLCanvasElement;
  camera: PerspectiveCamera;
  cameraAnimator: CameraAnimator;
  raycaster: Raycaster;
  scene: Scene;
  mouse: Vector2;
  cubes: Cube[];
  cubeAnimator: CubeAnimator;
  randomWalker: RandomWalker;
  timerBarAnimator: TimerBarAnimator;
  scoreBoard: Scoreboard;
  soundBoard: SoundBoard;
  highScore: Scoreboard;
  submitButton: SubmitButton;
  levelCard: LevelCard;
  levelCardAnimator: LevelCardAnimator;
  intersectable: Object3D<Object3DEventMap>[];
  levels: LevelConfiguration[];
  game: {
    currentRound: number;
    currentLevel: number;
    roundIsActive: boolean;
    isFullScreen: boolean;
    fakeOutCount: number;
    paused: boolean;
  };
}

const SAVED_HIGH_SCORE_KEY = "saved_high_score";

export default {
  setup() {
    const { t } = useI18n({
      useScope: "local",
    });
    return {
      t,
    };
  },
  data(): GameViewData {
    return {
      sceneId: "scene",
      canvas: {} as HTMLCanvasElement,
      camera: {} as PerspectiveCamera,
      cameraAnimator: {} as CameraAnimator,
      raycaster: new Raycaster(),
      mouse: new Vector2(),
      scene: {} as Scene,
      cubes: [],
      cubeAnimator: {} as CubeAnimator,
      randomWalker: {} as RandomWalker,
      timerBarAnimator: {} as TimerBarAnimator,
      scoreBoard: {} as Scoreboard,
      soundBoard: {} as SoundBoard,
      highScore: {} as Scoreboard,
      submitButton: {} as SubmitButton,
      levelCard: {} as LevelCard,
      levelCardAnimator: {} as LevelCardAnimator,
      intersectable: [],
      levels: this.levelConfigurations(),
      game: {
        currentRound: 0,
        currentLevel: 0,
        roundIsActive: false,
        isFullScreen: false,
        fakeOutCount: 0,
        paused: false,
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
    this.cameraAnimator = new CameraAnimator({
      camera
    });
    // Create and Add Objects to Scene
    const cubes: Cube[] = createCubes({
      rows: [3, 4, 3],
    });
    this.cubes = cubes;
    this.guaranteeAtLeastOnePointScoringCube();
    cubes.forEach((cube) => {
      addToScene(cube, scene);
    });
    this.intersectable.push(...this.cubes.map((cube) => cube.getRepresentation()));
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
    const scoreBoard = createScoreboard({
      text: this.t("score"),
      camera,
      color: 0x9966FF,
    });
    this.scoreBoard = scoreBoard;
    addToScene(scoreBoard, scene);
    const highScore = createScoreboard({
      text: this.t("high_score"),
      camera,
      color: 0x9966FF,
      position: {
        x: 0.16,
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
        this.handleInput({ key: " " } as KeyboardEvent);
      }
    });
    this.submitButton = submitButton;
    addToScene(submitButton, scene);
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
    const soundIcon = new SoundIcon();
    this.intersectable.push(soundIcon.getRepresentation());
    addToScene(soundIcon, scene);
    const fullscreenIcon = new FullscreenIcon();
    this.intersectable.push(fullscreenIcon.getRepresentation());
    addToScene(fullscreenIcon, scene);
    // Behaviors Setup
    this.prepFakeOut();
    const randomWalker = new RandomWalker({
      walkables: this.getWalkables()
    });
    this.randomWalker = randomWalker;
    this.levelCardAnimator.updateContentAndShow(this.currentLevelContent);
    this.soundBoard.setIsHeavy(this.cubesAreHeavy);
    this.soundBoard.startWind();
    // Interaction Setup
    this.canvas.addEventListener("click", this.onCanvasClick);
    this.canvas.addEventListener("keydown", this.handleInput);
    // Render Loop
    const animate = (time: DOMHighResTimeStamp) => {
      cubes.forEach((cube) => {
        const animationsArgs = {
          cube,
          time,
        };
        cubeAnimator.breathing({
          ...animationsArgs,
          shouldBreathe: this.shouldIdleBreathe,
        });
        cubeAnimator.shaking({
          ...animationsArgs
        });
      });
      if (this.noMoreCubesThatWeNeedToPress) {
        this.submitButton.indicateShouldPress(this.currentPointsState);
      }
      else {
        this.submitButton.indicateShouldNotPress();
      }
      if (this.shouldRandomWalk) {
        this.randomWalker.walk();
      }
      const countdownDone = timerBarAnimator.countdown(time);
      if (countdownDone) {
        this.loseAnimation();
      }
      submitButtonAnimator.update(time);
      adjustView({ canvas, renderer, camera });
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    // Kick-Off Render Loop
    requestAnimationFrame(animate);
  },
  beforeUnmount() {
    this.canvas.removeEventListener("click", this.onCanvasClick);
    this.canvas.removeEventListener("keydown", this.handleInput);
    this.soundBoard.stop();
    this.soundBoard.silenced = true;
  },
  methods: {
    // Game Interaction
    onCanvasClick(event: MouseEvent) {
      const haventStartedLevel = !this.game.roundIsActive;
      const intersected = this.getIntersectedObject(event);
      if (isSoundIcon(intersected)) {
        const soundIcon = intersected;
        soundIcon.toggle();
        this.toggleSilenced();
        if (haventStartedLevel)
          return;
      }
      if (isFullscreenIcon(intersected)) {
        const fullscreenIcon = intersected;
        fullscreenIcon.toggle();
        this.toggleFullScreen();
        if (haventStartedLevel)
          return;
      }

      if (this.isPaused) { return; }

      if (haventStartedLevel) {
        this.levelCard.hide();
        this.soundBoard.stopWind();
        this.soundBoard.startLevelBackground();
        this.game.roundIsActive = true;
        this.prepCubeToFlip();
        this.startCountDown();
        return;
      }
      if (isCube(intersected)) {
        const cube = intersected;
        const result = interactionResult({
          cube,
          loseState: CubeState.DONT_PRESS,
          pointsState: this.currentPointsState
        });
        if (this.cubesAreHeavy) {
          this.cameraAnimator.shake();
        }
        switch (result) {
          case InteractionResult.LOST:
            this.loseAnimation();
            break;
          case InteractionResult.POINTS:
            this.soundBoard.points();
            this.addPoints();
            cube.pressed();
            this.scrambleCubes();
            break;
          case InteractionResult.NO_POINTS:
            this.soundBoard.noPoints();
            cube.pressed();
            this.scrambleCubes();
            break;
        }
        this.fakeOut();
        this.prepLastOneRuns();
      }
      if (isSubmitButton(intersected)) {
        const submitButton = intersected;
        if (this.cubesAreHeavy) {
          this.cameraAnimator.shake({
            minDuration: 200,
            maxDuration: 350,
          });
        }
        submitButton.pressed();
      }
    },
    getIntersectedObject(event: MouseEvent): Maybe<Cube | ToggleableIcon> {
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
      const normalizedY = inversion * (canvasRelativeY / canvasHeight) * lengthOfNDCSquare +
        ndcUnit;
      // set Coordinates
      this.mouse.x = normalizedX;
      this.mouse.y = normalizedY;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.intersectable, false);
      if (intersects.length > 0) {
        return intersects[0].object.userData.object;
      }
      return undefined;
    },
    handleInput({ key }: KeyboardEvent) {
      const Keys = {
        Space: " ",
        Escape: "Escape",
      };

      switch (key) {
        case Keys.Space:
          if (this.didWin) {
            this.winAnimation();
          }
          else {
            this.loseAnimation();
          }
          break;
        case Keys.Escape:
          if (!this.game.roundIsActive) { break; }
          this.togglePaused();
          if (this.isPaused) {
            this.pause();
          } else {
            this.unpause();
          }
          break;
      }
    },
    // Game Animations
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
      this.animateLevelEnd({
        shakingDurationInMillis: 1500,
        shakeIntensity: 0.05,
        shakeScaleIncrease: 1,
      }, () => {
        this.cubes.forEach((cube) => {
          toggleLose(cube as Cube);
        });
      }, () => {
        this.resetGame();
      });
    },
    winAnimation() {
      this.soundBoard.win();
      this.animateLevelEnd({
        shakingDurationInMillis: 1500,
        shakeIntensity: 0.05,
        shakeScaleIncrease: 1,
      }, () => {
        this.cubes.forEach((cube) => {
          toggleWin(cube as Cube);
        });
      });
    },
    // Game Level and Round Behavior
    prepNextRound() {
      // Reset Objects
      this.timerBarAnimator.reset();
      this.submitButton.resetPosition();
      this.cubes.forEach((cube) => {
        cube.reset();
      });
      this.guaranteeAtLeastOnePointScoringCube();
      this.cubeAnimator.reset();

      if (this.levelIsOver) {
        this.prepNextLevel();
      }
      else {
        this.game.roundIsActive = true;
        this.startCountDown();
      }

      this.prepFakeOut();
      this.prepareRandomWalk();
      this.prepLastOneRuns();
      if (this.game.roundIsActive) {
        this.prepCubeToFlip();
      }
      this.soundBoard.setIsHeavy(this.cubesAreHeavy);
      this.submitButton.indicateShouldNotPress();

      this.updateHighScore();
    },
    guaranteeAtLeastOnePointScoringCube() {
      const atLeastOnePointScoringCube = this.cubes.filter((cube) => {
        return cube.state === this.currentPointsState
      }).length > 0;
      if (!atLeastOnePointScoringCube) {
        const cube = selectRandomFrom(this.cubes);
        cube.state = this.currentPointsState;
      }
    },
    endRound(): void {
      this.game.roundIsActive = false;
      this.game.currentRound += 1;
    },
    prepNextLevel() {
      this.game.currentRound = 0;
      this.game.currentLevel += 1;
      this.game.fakeOutCount = 0;
      this.soundBoard.stopLevelBackground();
      this.displayNextLevelCard();
      this.soundBoard.startWind();
    },
    // Game Behavior Implementation
    prepCubeToFlip() {
      if (this.shouldFlipCubes) {
        const nonScoringCubes = this.cubes.filter((cube) => {
          return cube.state !== this.currentPointsState;
        });
        const toFlip = selectRandomFrom(nonScoringCubes) as Cube;
        this.cubeAnimator.flip({
          cube: toFlip,
          endState: this.currentPointsState,
        });
      }
    },
    scrambleCubes() {
      if (this.shouldScrambleColors) {
        const unpressed = this.cubes.filter((cube) => {
          return cube.state !== CubeState.PRESSED;
        });
        let toPress = this.cubes.filter((cube) => {
          return cube.state === this.currentPointsState;
        }).length;
        while (!isEmpty(unpressed)) {
          const unpressedCube = popRandomFrom(unpressed);
          const needsShouldPress = toPress > 0;
          const animationArgs = {
            intervalTiming: 10,
            minTimeToFlip: 25,
            maxTimeToFlip: 100
          };
          if (needsShouldPress) {
            this.cubeAnimator.flip({
              ...animationArgs,
              cube: unpressedCube as Cube,
              endState: this.currentPointsState,
            });
            toPress -= 1;
            continue;
          }
          let availableStates = [
            CubeState.NOT_PRESSED,
            CubeState.SHOULD_PRESS,
            CubeState.DONT_PRESS,
          ];
          let invalidStates = [
            unpressedCube.state,
            this.currentPointsState
          ];
          invalidStates.forEach((state) => {
            availableStates = removeIfFound(state, availableStates);
          });
          this.cubeAnimator.flip({
            ...animationArgs,
            cube: unpressedCube as Cube,
            endState: selectRandomFrom(availableStates),
          });
        }
      }
    },
    prepFakeOut() {
      if (this.shouldFakeOut) {
        this.game.fakeOutCount = getRandomIntInclusive(1, 3);
        const pointScoringCubes = this.cubes.filter((cube) => {
          return cube.state === this.currentPointsState;
        });
        popRandomFrom(pointScoringCubes);
        pointScoringCubes.forEach((cube) => {
          const availableStates = removeIfFound(this.currentPointsState, [
            CubeState.NOT_PRESSED,
            CubeState.SHOULD_PRESS,
            CubeState.DONT_PRESS,
          ]);
          cube.state = selectRandomFrom(availableStates);
        });
      }
    },
    fakeOut() {
      const shouldFakeout = this.shouldFakeOut && this.game.fakeOutCount > 0;
      if (shouldFakeout) {
        this.game.fakeOutCount -= 1;
        const unpressed = this.cubes.filter((cube) => {
          return cube.state !== CubeState.PRESSED;
        });
        const unpressedCube = selectRandomFrom(unpressed);
        this.cubeAnimator.flip({
          cube: unpressedCube as Cube,
          endState: this.currentPointsState,
          intervalTiming: 10,
          minTimeToFlip: 25,
          maxTimeToFlip: 100
        });
      }
    },
    prepLastOneRuns() {
      if (this.lastOneShouldRun && this.onlyOneLeft) {
        this.randomWalker.setWalkables(this.getWalkables());
      }
    },
    prepareRandomWalk() {
      if (this.allShouldRun) {
        this.randomWalker.setWalkables(this.getWalkables());
      }
    },
    getWalkables(): Object3D<Object3DEventMap>[] {
      if (this.allShouldRun) {
        return this.cubes.map((cube) => cube.getRepresentation());
      }
      if (this.lastOneShouldRun && this.onlyOneLeft) {
        return this.cubes.filter((cube) => cube.state === this.currentPointsState).map((cube) => cube.getRepresentation());
      }
      return [];
    },
    // Game Actions
    addPoints() {
      addPoints(this.sessionScoreBoard, 50);
      this.updateHighScore();
    },
    displayNextLevelCard() {
      this.levelCardAnimator.updateContentAndShow(this.currentLevelContent);
    },
    startCountDown() {
      this.timerBarAnimator.startCountDown(this.currentRoundTimeInSeconds, performance.now());
    },
    resetGame() {
      this.scoreBoard.scoreCount = 0;
      this.game.roundIsActive = false;
      this.game.currentRound = 0;
      this.game.currentLevel = 0;
      this.game.fakeOutCount = 0;
      this.cubeAnimator.cancelFlips();
      this.timerBarAnimator.pause();
      this.timerBarAnimator.reset();
      this.prepareRandomWalk();
      this.prepLastOneRuns();
      this.displayNextLevelCard();
      this.soundBoard.stopLevelBackground();
      this.soundBoard.startWind();
      this.submitButton.resetPosition();
      this.cubes.forEach((cube) => {
        cube.reset();
      });
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
    togglePaused() {
      this.game.paused = !this.game.paused;
    },
    pause() {
      this.levelCardAnimator.updateContentAndShow({
        title: 'Paused',
        instructions: ''
      });
      this.timerBarAnimator.pause(performance.now());
    },
    unpause() {
      this.levelCard.hide();
      this.timerBarAnimator.resume();
    },
    // Game Configuration
    levelConfigurations(): LevelConfiguration[] {
      return [
        {
          content: {
            title: this.t("level_1"),
            instructions: this.t("level_1_instructions"),
          },
          roundTimeInSeconds: 5,
          numberOfRounds: 3,
          behaviors: [
            GameBehavior.SELECT_GREENS
          ]
        },
        {
          content: {
            title: this.t("level_2"),
            instructions: this.t("level_2_instructions"),
          },
          roundTimeInSeconds: 5,
          numberOfRounds: 5,
          behaviors: [
            GameBehavior.SELECT_GREENS,
            GameBehavior.CHANGE_RANDOM
          ]
        },
        {
          content: {
            title: this.t("level_3"),
            instructions: this.t("level_3_instructions"),
          },
          roundTimeInSeconds: 5,
          numberOfRounds: 5,
          behaviors: [
            GameBehavior.SELECT_GREENS,
            GameBehavior.LAST_ONE_RUNS,
          ]
        },
        {
          content: {
            title: this.t("level_4"),
            instructions: this.t("level_4_instructions"),
          },
          roundTimeInSeconds: 7,
          numberOfRounds: 5,
          behaviors: [
            GameBehavior.SELECT_GREENS,
            GameBehavior.CHANGE_COLORS_ON_TOUCH
          ]
        },
        {
          content: {
            title: this.t("level_5"),
            instructions: this.t("level_5_instructions"),
          },
          roundTimeInSeconds: 5,
          numberOfRounds: 5,
          behaviors: [
            GameBehavior.SELECT_GREENS,
            GameBehavior.CUBES_ARE_HEAVY,
          ]
        },
        {
          content: {
            title: this.t("level_6"),
            instructions: this.t("level_6_instructions"),
          },
          roundTimeInSeconds: 2.8,
          numberOfRounds: 5,
          behaviors: [
            GameBehavior.SELECT_GREENS
          ]
        },
        {
          content: {
            title: this.t("level_7"),
            instructions: this.t("level_7_instructions"),
          },
          roundTimeInSeconds: 2.8,
          numberOfRounds: 5,
          behaviors: [
            GameBehavior.SELECT_GREENS,
            GameBehavior.FAKE_OUT
          ]
        },
        {
          content: {
            title: this.t("level_8"),
            instructions: this.t("level_8_instructions"),
          },
          roundTimeInSeconds: 4,
          numberOfRounds: 5,
          behaviors: [
            GameBehavior.SELECT_GREENS,
            GameBehavior.ALL_RUN
          ]
        },
        {
          content: {
            title: this.t("level_9"),
            instructions: this.t("level_9_instructions"),
          },
          roundTimeInSeconds: 2.8,
          numberOfRounds: 5,
          behaviors: [
            GameBehavior.SELECT_BLUES
          ]
        },
        {
          content: {
            title: this.t("level_10"),
            instructions: this.t("level_10_instructions"),
          },
          roundTimeInSeconds: 6,
          numberOfRounds: Number.POSITIVE_INFINITY,
          behaviors: [
            GameBehavior.SELECT_GREENS,
            GameBehavior.CHANGE_RANDOM,
            GameBehavior.CUBES_ARE_HEAVY,
            GameBehavior.ALL_RUN,
            GameBehavior.LAST_ONE_RUNS,
          ]
        },
      ];
    },
    toggleFullScreen() {
      this.game.isFullScreen = !this.game.isFullScreen;
      if (this.game.isFullScreen) {
        makeFullScreen(this.$refs.container as Element);
        return;
      }
      exitFullScreen(this.$refs.container as Element);
    },
  },
  computed: {
    // Game Behavior
    shouldFlipCubes(): boolean {
      return this.currentLevelBehaviors.includes(GameBehavior.CHANGE_RANDOM);
    },
    shouldScrambleColors(): boolean {
      return this.currentLevelBehaviors.includes(GameBehavior.CHANGE_COLORS_ON_TOUCH);
    },
    cubesAreHeavy(): boolean {
      return this.currentLevelBehaviors.includes(GameBehavior.CUBES_ARE_HEAVY);
    },
    shouldFakeOut(): boolean {
      return this.currentLevelBehaviors.includes(GameBehavior.FAKE_OUT);
    },
    lastOneShouldRun(): boolean {
      return this.currentLevelBehaviors.includes(GameBehavior.LAST_ONE_RUNS);
    },
    allShouldRun(): boolean {
      return this.currentLevelBehaviors.includes(GameBehavior.ALL_RUN);
    },
    shouldRandomWalk(): boolean {
      if (this.allShouldRun) {
        return this.game.roundIsActive;
      }
      if (this.lastOneShouldRun) {
        return this.game.roundIsActive && this.onlyOneLeft;
      }
      return false;
    },
    onlyOneLeft(): boolean {
      return this.cubes.filter((cube) => {
        return cube.state === this.currentPointsState;
      }).length == 1;
    },
    currentPointsState(): CubeState {
      if (this.currentLevelBehaviors.includes(GameBehavior.SELECT_BLUES)) {
        return CubeState.NOT_PRESSED;
      }
      return CubeState.SHOULD_PRESS;
    },
    // Game State
    canInteract(): boolean {
      return this.game.roundIsActive && !this.game.paused;
    },
    shouldIdleBreathe(): boolean {
      return !this.game.roundIsActive;
    },
    didWin(): boolean {
      return this.noMoreCubesThatWeNeedToPress;
    },
    noMoreCubesThatWeNeedToPress(): boolean {
      const noMoreCubesThatWeNeedToPress = this.cubes.filter((cube) => cube.state === this.currentPointsState)
        .length === 0;
      return noMoreCubesThatWeNeedToPress && this.canInteract;
    },
    levelIsOver(): boolean {
      return this.game.currentRound >= this.numberOfRoundsInCurrentLevel;
    },
    isPaused(): boolean {
      return this.game.paused;
    },
    // Game Objects
    sessionScoreBoard(): Scoreboard {
      return this.scoreBoard as Scoreboard;
    },
    highScoreBoard(): Scoreboard {
      return this.highScore as Scoreboard;
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
    // Game Configuration
    currentLevel(): LevelConfiguration {
      return this.levels[this.game.currentLevel];
    },
    currentLevelContent(): LevelContent {
      return this.currentLevel.content;
    },
    currentRoundTimeInSeconds(): number {
      return this.currentLevel.roundTimeInSeconds;
    },
    numberOfRoundsInCurrentLevel(): number {
      return this.currentLevel.numberOfRounds;
    },
    currentLevelBehaviors(): GameBehavior[] {
      return this.currentLevel.behaviors;
    },
  },
  watch: {
    '$i18n.locale': function () {
      nextTick(() => {
        this.levels = this.levelConfigurations();
        this.levelCardAnimator.updateContent(this.currentLevelContent);
        this.scoreBoard.updatePrefix(this.t("score"));
        this.highScore.updatePrefix(this.t("high_score"));
      });
    }
  },
  components: {
    Enlarger
  }
};

</script>

<template>
  <div class="games" ref="container">
    <h1>{{ t("title") }}</h1>
    <h2>{{ t("game") }}</h2>
    <div class="canvas-container">
      <canvas :id="sceneId" tabindex="0"></canvas>
    </div>
  </div>
  <Enlarger></Enlarger>
</template>

<style scoped lang="scss">
.fullscreen {

  h1,
  h2 {
    display: none
  }

  div.canvas-container {
    position: fixed;
    left: 0;
    right: 0;
    top: 25%;
    bottom: 0;
    margin: 0;

    @media screen and (orientation:landscape) {
      top: 0;
      height: 100%;
    }
  }
}

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
    "game": "Cube Up!",
    "level_1": "Level 1",
    "level_2": "Level 2",
    "level_3": "Level 3",
    "level_4": "Level 4",
    "level_5": "Level 5",
    "level_6": "Level 6",
    "level_7": "Level 7",
    "level_8": "Level 8",
    "level_9": "Level 9",
    "level_10": "Level 10",
    "level_1_instructions": "Hit all the greens!",
    "level_2_instructions": "Beware the Changing Cubes!",
    "level_3_instructions": "Run away!",
    "level_4_instructions": "Scramble the Colors!",
    "level_5_instructions": "This is heavy doc!",
    "level_6_instructions": "Faster, Faster!",
    "level_7_instructions": "JK!",
    "level_8_instructions": "Cheese It!",
    "level_9_instructions": "Hit all the Blues!",
    "level_10_instructions": "Chaos",
    "score": "Score:",
    "high_score": "High Score:"
  },
  "es": {
    "title": "Juego",
    "game": "Cubos Arriba!",
    "level_1": "1er Nivel",
    "level_2": "2o Nivel",
    "level_3": "3er Nivel",
    "level_4": "4o Nivel",
    "level_5": "5o Nivel",
    "level_6": "6o Nivel",
    "level_7": "7o Nivel",
    "level_8": "8o Nivel",
    "level_9": "9o Nivel",
    "level_10": "10o Nivel",
    "level_1_instructions": "Dale a los verdes!",
    "level_2_instructions": "Cuidado, algunos cambian!",
    "level_3_instructions": "Hecha correr!",
    "level_4_instructions": "Revlueve los colores!",
    "level_5_instructions": "Esto está pesado doc!",
    "level_6_instructions": "Mas Rapido!",
    "level_7_instructions": "No te creas!",
    "level_8_instructions": "Desbándense!",
    "level_9_instructions": "Ahora los azules!",
    "level_10_instructions": "Caos",
    "score": "Pts. :",
    "high_score": "Pts. Alto:"
  },
  "ca": {
    "title": "Joc",
    "game": "Cubs Amunt!",
    "level_1": "1r Nivell",
    "level_2": "2n Nivell",
    "level_3": "3r Nivell",
    "level_4": "4t Nivell",
    "level_5": "5è Nivell",
    "level_6": "6è Nivell",
    "level_7": "7è Nivell",
    "level_8": "8è Nivell",
    "level_9": "9è Nivell",
    "level_10": "10è Nivell",
    "level_1_instructions": "Colpeja tots els verds!",
    "level_2_instructions": "Compte amb els cubs canviants!",
    "level_3_instructions": "Fuig!",
    "level_4_instructions": "Barreja els colors!",
    "level_5_instructions": "Esto está pesado doc!",
    "level_6_instructions": "Més ràpid!",
    "level_7_instructions": "No t'ho crees!",
    "level_8_instructions": "Desbandin-se!",
    "level_9_instructions": "Ara els blaus!",
    "level_10_instructions": "Caos",
    "score": "Pts.: ",
    "high_score": "Pts. Alt:"
  }
}
</i18n>