import { fromMaybe } from "@luvle/utils";
import { Vector3 } from "three";
import type { CubeAnimator } from "./cubeAnimator";
import type { SubmitButton } from "./submitButton";

interface SubmitButtonAnimatorArgs {
  submitButton: SubmitButton;
  cubeAnimator: CubeAnimator;
  rotationSpeed?: number;
}

const SHAKING_DURATION_IN_MILLIS = 150 * 4;
const SHAKE_INTENSITY = 0.1 * 1.2;
const SHAKE_SCALE_INCREASE = 1;


export class SubmitButtonAnimator {
  private readonly submitButton: SubmitButton;
  private readonly cubeAnimator: CubeAnimator;
  private readonly worldAxis: Vector3;
  private rotationSpeed: number;
  private lastAnimated: number = 0;

  constructor(args: SubmitButtonAnimatorArgs) {
    const {
      submitButton,
      cubeAnimator,
      rotationSpeed
    } = args;

    this.submitButton = submitButton;
    this.cubeAnimator = cubeAnimator;
    this.worldAxis = new Vector3(0, 0, 1);
    
    this.rotationSpeed = fromMaybe({
      maybe: rotationSpeed,
      fallback: 0.01
    });
  }

  public update(time: DOMHighResTimeStamp): void {
    const deltaTimeInMilis = (time - this.lastAnimated);
    this.lastAnimated = time;

    this.submitButton.getRepresentation().rotateOnWorldAxis(this.worldAxis, this.rotationSpeed * deltaTimeInMilis);
    this.cubeAnimator.shaking({
      cube: this.submitButton.cube,
      time,
      shakeOverrides: {
        shakingDurationInMillis: SHAKING_DURATION_IN_MILLIS, 
        shakeIntensity: SHAKE_INTENSITY,
        shakeScaleIncrease: SHAKE_SCALE_INCREASE,
      }
    });
  }
}