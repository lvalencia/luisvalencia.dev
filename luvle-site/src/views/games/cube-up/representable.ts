import type { Object3D } from "three";

export interface Representable {
  getRepresentation(): Object3D;
}