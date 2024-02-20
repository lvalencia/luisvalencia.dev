import { getRandomIntInclusive, selectRandomFrom } from "@/helpers/random";
import { fromMaybe } from "@luvle/utils";
import {
  BoxGeometry,
  BufferGeometry,
  Color,
  Euler,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Vector3,
} from "three";
import type { SimpleVector } from "../shared/simpleVector";
import type { Edge } from "./edges";
import type { Representable } from "./representable";

export function isCube(cube: any): cube is Cube {
  return cube instanceof Cube;
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
];

interface CubeArgs {
  cubeState?: CubeState;
  material?: MeshStandardMaterial;
  geometry?: BoxGeometry;
  mesh?: Mesh;
  frequency?: number;
}

export class Cube implements Representable {
  private readonly material: MeshStandardMaterial;
  private readonly geometry: BoxGeometry;
  private readonly mesh: Mesh;
  private readonly frequency: number;
  private cubeState: CubeState;
  private pressedAt: number;
  private lastPosition: SimpleVector;
  private lastScale: Vector3;

  constructor(args: CubeArgs = {}) {
    const { 
      geometry, 
      cubeState, 
      material, 
      mesh, 
      frequency,
    } = args;

    this.cubeState = fromMaybe({
      maybe: cubeState,
      fallback: selectRandomFrom(CubeStates)
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

    this.frequency = fromMaybe({
      maybe: frequency,
      fallback: getRandomIntInclusive(1, 5) / 3_200,
    });

    const { x, y, z } = this.mesh.position;

    this.lastPosition = {
      x,
      y,
      z,
    };

    this.lastScale = this.mesh.scale.clone();

    this.pressedAt = 0;

    this.mesh.userData = {
      object: this,
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
    this.cubeState = selectRandomFrom(CubeStates);
    this.material.color.set(this.cubeState);
    this.position = this.lastPosition;
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

  public pressWithoutChangingAppearance(): void {
    this.pressedAt = performance.now();
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

  public set lastPressed(pressedAt: number) {
    this.pressedAt = pressedAt;
  }

  public get state(): CubeState {
    return this.cubeState;
  }

  public set state(state: CubeState) {
    this.cubeState = state;
    this.material.color.set(this.cubeState);
  }

  public get position(): Vector3 {
    return this.mesh.position;
  }

  public set position({ x, y, z }: SimpleVector) {
    this.lastPosition = {
      x,
      y,
      z,
    };
    this.mesh.position.set(x, y, z);
  }

  public get lastSetPosition():  SimpleVector {
    return this.lastPosition;
  }

  public get scale(): Vector3 {
    return this.mesh.scale;
  }

  public set scale({x, y, z}: SimpleVector) {
    this.lastScale.set(x,y,z);
    this.mesh.scale.set(x,y,z);
  }

  public get lastSetScale(): Vector3 {
    return this.lastScale;
  }

  public get color(): Color {
    return this.material.color;
  }

  public get cubeSize(): number {
    return this.geometry.parameters.width;
  }

  public get rotation(): Euler {
    return this.mesh.rotation;
  }

  public get breathingFrequency(): number {
    return this.frequency;
  }

  public set userData(obj: any) {
    this.mesh.userData = obj;
  }
}


