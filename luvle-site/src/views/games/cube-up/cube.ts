import { getRandomIntInclusive } from "@/helpers/random";
import { fromMaybe } from "@luvle/utils";
import {
  BoxGeometry,
  BufferGeometry,
  Euler,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Scene,
  Vector3,
} from "three";
import type { Edge } from "./edges";

export function addToScene(cube: Cube, scene: Scene) {
  scene.add(cube.getRepresentation());
}

export enum CubeState {
  NOT_PRESSED = 0x0099ff,
  SHOULD_PRESS = 0x66ff66,
  DONT_PRESS = 0xff6666,
  PRESSED = 0xefefef,
}

const CubeStates = [
  CubeState.NOT_PRESSED,
  CubeState.SHOULD_PRESS,
  CubeState.DONT_PRESS,
  CubeState.PRESSED,
];

interface SimplePosition {
  x: number;
  y: number;
  z: number;
}

export interface ShakeValues {
  shakingDurationInMillis: number;
  shakeIntensity: number;
  shakeScaleIncrease: number;
}

interface CubeArgs {
  cubeState?: CubeState;
  material?: MeshStandardMaterial;
  geometry?: BoxGeometry;
  mesh?: Mesh;
  breathingFrequency?: number;
}

const BREATHING_INTENSITY = 0.2;
const SHAKING_DURATION_IN_MILLIS = 150;
const SHAKE_INTENSITY = 0.1;
const SHAKE_SCALE_INCREASE = 1.2;

export class Cube {
  private readonly material: MeshStandardMaterial;
  private readonly geometry: BoxGeometry;
  private readonly mesh: Mesh;
  private readonly breathingFrequency: number;
  private cubeState: CubeState;
  private pressedAt: number;
  private lastPosition: SimplePosition;
  private shakingDurationInMillis: number = SHAKING_DURATION_IN_MILLIS;
  private shakeIntensity: number = SHAKE_INTENSITY;
  private shakeScaleIncrease: number = SHAKE_SCALE_INCREASE;

  constructor(args: CubeArgs = {}) {
    const { geometry, cubeState, material, mesh, breathingFrequency } = args;

    this.cubeState = fromMaybe({
      maybe: cubeState,
      fallback: randomCubeState(),
    });

    this.material = fromMaybe({
      maybe: material,
      fallback: new MeshStandardMaterial({ color: this.cubeState }),
    });

    this.geometry = fromMaybe({
      maybe: geometry,
      fallback: new BoxGeometry(1, 1, 1),
    });

    this.mesh = fromMaybe({
      maybe: mesh,
      fallback: new Mesh(this.geometry, this.material),
    });

    this.breathingFrequency = fromMaybe({
      maybe: breathingFrequency,
      fallback: getRandomIntInclusive(1, 5) / 3_200,
    });

    const { x, y, z } = this.mesh.position;

    this.lastPosition = {
      x,
      y,
      z,
    };

    this.pressedAt = 0;

    this.mesh.userData = {
      cube: this,
    };
  }

  // Configuration
  public enableShadows(): void {
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
  }

  public addEdges(edges: Edge): void {
    this.mesh.add(edges.getRepresentation());
  }

  // State Manipulation
  public reset(): void {
    this.cubeState = randomCubeState();
    this.material.color.set(this.cubeState);
    this.position = this.lastPosition;
    this.shakingDurationInMillis = SHAKING_DURATION_IN_MILLIS;
    this.shakeIntensity = SHAKE_INTENSITY;
    this.shakeScaleIncrease = SHAKE_SCALE_INCREASE;
  }

  public setShakeValues(values: ShakeValues): void {
    const { shakingDurationInMillis, shakeIntensity, shakeScaleIncrease } =
      values;
    this.shakingDurationInMillis = shakingDurationInMillis;
    this.shakeIntensity = shakeIntensity;
    this.shakeScaleIncrease = shakeScaleIncrease;
  }

  // Animations
  public breathingAnimation(
    time: DOMHighResTimeStamp,
    shouldBreathe: boolean
  ): void {
    if (shouldBreathe) {
      this.position.y =
        BREATHING_INTENSITY * Math.sin(time * this.breathingFrequency);
    } else {
      this.position.y = 0;
    }
  }

  public shakingAnimation(time: DOMHighResTimeStamp): void {
    if (this.pressedAt === 0) return;

    const startTime = this.pressedAt;

    const elapsedTime = time - startTime;
    const shouldAnimate = elapsedTime < this.shakingDurationInMillis;

    if (shouldAnimate) {
      // Shake
      this.position.x += (Math.random() - 0.5) * this.shakeIntensity;
      this.position.y += (Math.random() - 0.5) * this.shakeIntensity;
      this.position.z += (Math.random() - 0.5) * this.shakeIntensity;

      // Scale
      const progress = elapsedTime / this.shakingDurationInMillis;
      const scale = 1 + progress * (this.shakeScaleIncrease - 1); // Linearly interpolate scale
      this.mesh.scale.set(scale, scale, scale);

      return;
    }

    // Stop and Reset Shaking Animation
    this.pressedAt = 0;
    this.position = this.lastPosition;
    this.mesh.scale.set(1, 1, 1);
  }

  public toggleLose(): void {
    const updatedColor =
      this.material.color.getHex() === CubeState.DONT_PRESS
        ? CubeState.NOT_PRESSED
        : CubeState.DONT_PRESS;
    this.material.color.set(updatedColor);
  }

  public toggleWin(): void {
    const updatedColor =
      this.material.color.getHex() === CubeState.SHOULD_PRESS
        ? CubeState.NOT_PRESSED
        : CubeState.SHOULD_PRESS;
    this.material.color.set(updatedColor);
  }

  // Interactions
  public pressed(): void {
    this.pressedAt = performance.now();
    this.cubeState = CubeState.PRESSED;
    this.material.color.set(this.cubeState);
  }

  public unpress(): void {
    this.pressedAt = performance.now();
    this.cubeState = CubeState.NOT_PRESSED;
    this.material.color.set(this.cubeState);
  }

  // Setters / Getters
  public getGeometry(): BufferGeometry {
    return this.geometry;
  }

  public getRepresentation(): Object3D {
    return this.mesh;
  }

  public get lastPressed(): number {
    return this.pressedAt;
  }

  public get state(): CubeState {
    return this.cubeState;
  }

  public get cubeSize(): number {
    return this.geometry.parameters.width;
  }

  public get rotation(): Euler {
    return this.mesh.rotation;
  }

  public get position(): Vector3 {
    return this.mesh.position;
  }

  public set position({ x, y, z }: SimplePosition) {
    this.lastPosition = {
      x,
      y,
      z,
    };
    this.mesh.position.set(x, y, z);
  }
}

function randomCubeState(): CubeState {
  return CubeStates[getRandomIntInclusive(0, CubeStates.length - 1)];
}
