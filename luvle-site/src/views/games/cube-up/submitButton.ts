import { fromMaybe } from "@luvle/utils";
import type { Euler, Object3D, Object3DEventMap, Vector3 } from "three";
import { Cube, CubeState } from "./cube";
import type { Representable } from "./representable";

export function isSubmitButton(submitButton: any): submitButton is SubmitButton  {
  return submitButton instanceof SubmitButton;
}

interface SubmitButtonArgs {
  onClick?: () => void;
  dontPressColor?: number;
  pressColor?: number;
  initialColor?: number;
}

export class SubmitButton implements Representable {
  private readonly dontPressColor: number;
  private readonly pressColor: number;
  private readonly onClick: () => void;
  private readonly _cube: Cube;

  constructor(args: SubmitButtonArgs = {}) {
    const {
      dontPressColor,
      pressColor,
      onClick,
      initialColor
    } = args;

    this.dontPressColor = fromMaybe({
      maybe: dontPressColor,
      fallback: CubeState.DONT_PRESS
    });

    this.pressColor = fromMaybe({
      maybe: pressColor,
      fallback: CubeState.SHOULD_PRESS
    });
    const initialCubeState = fromMaybe({
      maybe: initialColor,
      fallback: CubeState.DONT_PRESS
    })

    this.onClick = fromMaybe({
      maybe: onClick,
      fallback: () => {}
    });

    this._cube = new Cube({
      cubeState: initialCubeState
    });
    this._cube.userData = {
      object: this
    };

    this.cube.scale = {
      x: 0.8,
      y: 0.8,
      z: 0.8
    }
  }

  public pressed() {
    this.cube.pressWithoutChangingAppearance();
    this.onClick();
  }

  public indicateShouldPress(): void {
    this.cube.state = CubeState.SHOULD_PRESS;
  }

  public indicateShouldNotPress(): void {
    this.cube.state = CubeState.DONT_PRESS;
  }

  public get cube(): Cube {
    return this._cube;
  }

  public get position(): Vector3 {
    return this.cube.position;
  }

  public get rotation(): Euler {
    return this.cube.rotation;
  }

  public getRepresentation(): Object3D<Object3DEventMap> {
    return this.cube.getRepresentation();
  }
}