import { fromMaybe } from "@luvle/utils";
import { Vector3, type Object3D, type Object3DEventMap } from "three";
import type { Cube } from "./cube";

interface RandomWalkerArgs {
  walkables: Object3D<Object3DEventMap>[];
  xLowerBound?: number;
  xUpperBound?: number;
  zLowerBound?: number;
  zUpperBound?: number;
  stepSize?: number;
}

interface WalkData {
  walkable: Object3D<Object3DEventMap>;
  target: Vector3;
}

export class RandomWalker {
  private readonly xLowerBound: number
  private readonly xUpperBound: number
  private readonly zLowerBound: number
  private readonly zUpperBound: number
  private readonly stepSize: number
  private walkData!: WalkData[];

  constructor(args: RandomWalkerArgs) {
    const {
      walkables,
      xLowerBound,
      xUpperBound,
      zLowerBound,
      zUpperBound,
      stepSize
    } = args;

    this.xLowerBound = fromMaybe({
      maybe: xLowerBound,
      fallback: -4
    });

    this.xUpperBound = fromMaybe({
      maybe: xUpperBound,
      fallback: 4
    });

    this.zLowerBound = fromMaybe({
      maybe: zLowerBound,
      fallback: -3
    });

    this.zUpperBound = fromMaybe({
      maybe: zUpperBound,
      fallback: 2
    });

    this.stepSize = fromMaybe({
      maybe: stepSize,
      fallback: 0.05
    });

    this.setWalkables(walkables);
  }

  public walk() {
    this.walkData.forEach(({walkable, target}) => {
      if (walkable.position.distanceTo(target) > 0.05) {
        walkable.position.lerp(target, this.stepSize);
      } 
    });
  }

  public setWalkables(walkables:  Object3D<Object3DEventMap>[]): void {
    this.walkData = walkables.map((walkable) => {
      const target = this.generateRandomTarget();
      const {
        x,y,z 
      } = target;

      return {
        walkable,
        target,
      }
    });
  }

  private generateRandomTarget(): Vector3 {
    const randomX = Math.random() * (this.xUpperBound - this.xLowerBound) + this.xLowerBound;
    const randomZ = Math.random() * (this.zUpperBound - this.zLowerBound) + this.zLowerBound;

    return new Vector3(
      randomX,
      0,
      randomZ
    );
  }
  

}