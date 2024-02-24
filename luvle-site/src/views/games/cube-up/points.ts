import { fromMaybe } from "@luvle/utils";
import { Text } from "troika-three-text";
import type { Representable } from "./representable";
import type { Euler, Object3D, Object3DEventMap, Vector3 } from "three";

interface PointsArgs {
  color?: number;
  points: number;
}

const url = new URL(
  '../../../assets/fonts/VT323-Regular.ttf',
  import.meta.url
);
const FontURI = url.href;

export class Points implements Representable {
  private readonly points: Text;

  constructor(args: PointsArgs) {
    const {
      color,
      points
    } = args;
    this.points = new Text();

    this.points.text = `+${points}`;
    this.points.anchorX = 'center';
    this.points.anchorY = 'middle';
    this.points.font = FontURI;
    this.points.color = fromMaybe({
      maybe: color,
      fallback: 0x9966FF
    });
    this.points.fontSize = 1;
    this.points.sync();
  }
  getRepresentation(): Object3D<Object3DEventMap> {
    return this.points;
  }

  public destroy() {
    return this.points.dispose();
  }

  public get position(): Vector3 {
    return this.points.position;
  }

  public get rotation(): Euler {
    return this.points.rotation;
  }

  public get scale(): Vector3 {
    return this.points.scale;
  }

  public get opacity(): number {
    return this.points.material.opacity;
  }

  public set opacity(opacity: number) { 
    this.points.material.opacity = opacity;
  }
}