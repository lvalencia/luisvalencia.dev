import { getRandomIntInclusive } from "@/helpers/random";
import { fromMaybe } from "@luvle/utils";
import type { PerspectiveCamera } from "three";

// DRY out shake behvior into own component

const SHAKE_INTENSITY = 0.16;
const INTERVAL_FREQUENCY_IN_MILLIS = 10;
const MIN_SHAKE_DURATION = 50;
const MAX_SHAKE_DURATION = 200;

interface CameraAnimatorArgs {
  camera: PerspectiveCamera;
}

interface ShakeOverrides {
  shakeIntensity?: number;
  intervalFrequency?: number;
  minDuration?: number;
  maxDuration?: number;
}

export class CameraAnimator {
  private readonly camera: PerspectiveCamera;
  private shakeAnimation: any;

  constructor(args: CameraAnimatorArgs) {
    const {
      camera 
    } = args;
    this.camera = camera;
  }

  public shake(overrides: ShakeOverrides = {}) { 
    if (this.isAnimating) return;

    let {
      shakeIntensity,
      intervalFrequency,
      minDuration,
      maxDuration,
    } = overrides;

    shakeIntensity = fromMaybe({
      maybe: shakeIntensity,
      fallback: SHAKE_INTENSITY
    });

    intervalFrequency = fromMaybe({
      maybe: intervalFrequency,
      fallback: INTERVAL_FREQUENCY_IN_MILLIS
    });

    minDuration = fromMaybe({
      maybe: minDuration,
      fallback: MIN_SHAKE_DURATION
    });

    maxDuration = fromMaybe({
      maybe: maxDuration,
      fallback: MAX_SHAKE_DURATION
    });
    
    const {
      x: posX,
      y: posY,
      z: posZ
    } = this.camera.position;

    // There's some duplication with shaking; might want to DRY this out
    const interval = setInterval(() => {
      this.camera.position.x += (Math.random() - 0.5) * shakeIntensity!;
      this.camera.position.y += (Math.random() - 0.5) * shakeIntensity!;
      this.camera.position.z += (Math.random() - 0.5) * shakeIntensity!;
    }, intervalFrequency);

    this.shakeAnimation = interval;

    const animationTime = getRandomIntInclusive(minDuration, maxDuration);

    setTimeout(() => {
      clearInterval(interval);
      this.shakeAnimation = undefined;

      this.camera.position.set(posX, posY, posZ);
    }, animationTime);
  }

  private get isAnimating(): boolean {
    return !!this.shakeAnimation;
  }
}