import { getRandomIntInclusive } from "@/helpers/random";
import { fromMaybe } from "@luvle/utils";
import { CubeState, type Cube } from "./cube";

const BREATHING_INTENSITY = 0.2;
const SHAKING_DURATION_IN_MILLIS = 150;
const SHAKE_INTENSITY = 0.1;
const SHAKE_SCALE_INCREASE = 1.2;

interface CubeAnimatorArgs {
  shakingDurationInMillis?: number;
  shakeIntensity?: number;
  shakeScaleIncrease?: number;
}

export type ShakeValues = Required<Pick<CubeAnimatorArgs, "shakingDurationInMillis"  | "shakeIntensity" | "shakeScaleIncrease">>;

interface AnimateArgs {
  cube: Cube,
  time: DOMHighResTimeStamp,
}

interface AnimateBreathingArgs extends AnimateArgs {
  shouldBreathe: boolean
}

interface AnimateShakingArgs extends AnimateArgs {
  shakeOverrides?: ShakeValues
}

interface AnimateFlipArgs extends Omit<AnimateShakingArgs, 'time'> {
  endState: CubeState;
}

export class CubeAnimator {
  private shakingDurationInMillis: number;
  private shakeIntensity: number;
  private shakeScaleIncrease: number;
  private flipIntervals: Record<string, unknown> = {}; 

  constructor(args: CubeAnimatorArgs = {}) {
    const {
      shakingDurationInMillis,
      shakeIntensity,
      shakeScaleIncrease,
    } = args;

    this.shakingDurationInMillis = fromMaybe({
      maybe: shakingDurationInMillis,
      fallback: SHAKING_DURATION_IN_MILLIS
    });

    this.shakeIntensity = fromMaybe({
      maybe: shakeIntensity,
      fallback: SHAKE_INTENSITY
    });

    this.shakeScaleIncrease = fromMaybe({
      maybe: shakeScaleIncrease,
      fallback: SHAKE_SCALE_INCREASE
    });
  }

  public setShakeValues(values: ShakeValues): void {
    const { shakingDurationInMillis, shakeIntensity, shakeScaleIncrease } =
      values;
    this.shakingDurationInMillis = shakingDurationInMillis;
    this.shakeIntensity = shakeIntensity;
    this.shakeScaleIncrease = shakeScaleIncrease;
  }

  public reset(): void {
    this.shakingDurationInMillis = SHAKING_DURATION_IN_MILLIS;
    this.shakeIntensity = SHAKE_INTENSITY;
    this.shakeScaleIncrease = SHAKE_SCALE_INCREASE;
  }

  public breathing({
    cube,
    time,
    shouldBreathe,
  }: AnimateBreathingArgs): void {
    if (shouldBreathe) {
      cube.position.y =
        BREATHING_INTENSITY * Math.sin(time * cube.breathingFrequency);
    } else {
      cube.position.y = 0;
    }
  }

  public shaking({
    cube,
    time,
    shakeOverrides,
  }: AnimateShakingArgs) {
    if (cube.lastPressed === 0) return;

    const {
      shakingDurationInMillis,
      shakeIntensity,
      shakeScaleIncrease
    } = fromMaybe({
      maybe: shakeOverrides,
      fallback: {
        shakingDurationInMillis: this.shakingDurationInMillis,
        shakeIntensity: this.shakeIntensity,
        shakeScaleIncrease: this.shakeScaleIncrease, 
      } 
    });

    const startTime = cube.lastPressed;

    const elapsedTime = time - startTime;
    const shouldAnimate = elapsedTime < shakingDurationInMillis;

    if (shouldAnimate) {
      // Shake
      cube.position.x += (Math.random() - 0.5) * shakeIntensity;
      cube.position.y += (Math.random() - 0.5) * shakeIntensity;
      cube.position.z += (Math.random() - 0.5) * shakeIntensity;

      // Scale
      const progress = elapsedTime / shakingDurationInMillis;
      const scaleMax = cube.lastSetScale.x;
      const scale = scaleMax + progress * (shakeScaleIncrease - scaleMax); // Linearly interpolate scale
      cube.scale.set(scale, scale, scale);

      return;
    }

    // Stop and Reset Shaking Animation
    cube.lastPressed = 0;
    cube.position = cube.lastSetPosition;
    const {
      x, y, z
    } = cube.lastSetScale;
    cube.scale.set(x, y, z);
  }

  public flip(args: AnimateFlipArgs): void {
    const {
      cube,
      endState,
      shakeOverrides,
    } = args;
    
    const {
      x: posX,
      y: posY,
      z: posZ
    } = cube.position;

    const {
      x: scaleX,
      y: scaleY,
      z: scaleZ
    } = cube.scale;

    const {
      shakeIntensity,
      shakeScaleIncrease
    } = fromMaybe({
      maybe: shakeOverrides,
      fallback: {
        shakingDurationInMillis: this.shakingDurationInMillis,
        shakeIntensity: this.shakeIntensity,
        shakeScaleIncrease: this.shakeScaleIncrease, 
      } 
    });

    const interval = setInterval(() => {
      // Shake
      cube.position.x += (Math.random() - 0.5) * shakeIntensity;
      cube.position.y += (Math.random() - 0.5) * shakeIntensity;
      cube.position.z += (Math.random() - 0.5) * shakeIntensity;

      // Scale
      const scaleMax = cube.lastSetScale.x;
      const scale = scaleMax + Math.random() * (shakeScaleIncrease - scaleMax); // Linearly interpolate scale
      cube.scale.set(scale, scale, scale);
    }, 25);

    this.flipIntervals[String(interval)] = undefined;

    const animationTime = getRandomIntInclusive(500, 2000);

    setTimeout(() => {
      clearInterval(interval);
      delete this.flipIntervals[String(interval)];

      cube.position.set(posX, posY, posZ);
      cube.scale.set(scaleX, scaleY, scaleZ);
      cube.state = endState;
    }, animationTime);
  }
  public cancelFlips(): void {
    Object.keys(this.flipIntervals).forEach((interval) => {
      clearInterval(Number(interval));
    });
  }
}

export function toggleLose(cube: Cube): void {
  const updatedColor =
    cube.color.getHex() === CubeState.DONT_PRESS
      ? CubeState.NOT_PRESSED
      : CubeState.DONT_PRESS;
  cube.color.set(updatedColor);
}

export function toggleWin(cube: Cube): void {
  const updatedColor =
    cube.color.getHex() === CubeState.SHOULD_PRESS
      ? CubeState.NOT_PRESSED
      : CubeState.SHOULD_PRESS;
  cube.color.set(updatedColor);
}