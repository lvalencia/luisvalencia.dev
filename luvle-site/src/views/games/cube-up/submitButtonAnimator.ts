import { fromMaybe } from "@luvle/utils";
import { Vector3 } from "three";
import type { SubmitButton } from "./submitButton";

interface SubmitButtonAnimatorArgs {
  submitButton: SubmitButton;
  rotationSpeed?: number;
}
export class SubmitButtonAnimator {
  private readonly submitButton;
  private readonly worldAxis: Vector3;
  private rotationSpeed: number;
  private lastAnimated: number = 0;

  constructor(args: SubmitButtonAnimatorArgs) {
    const {
      submitButton,
      rotationSpeed
    } = args;

    this.submitButton = submitButton;
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
    this.submitButton.cube.shakingAnimation(time);
  }
}