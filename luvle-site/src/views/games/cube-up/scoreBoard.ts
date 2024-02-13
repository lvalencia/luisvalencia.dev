import { fromMaybe } from "@luvle/utils";
import { Text } from "troika-three-text";
import { Euler, Vector3 } from "three";
import type { Representable } from "./representable";
import type { Object3DEventMap, Object3D } from "three";

interface ScoreboardArgs {
  text: string;
  initialScore?: number;
  color?: number;
}

const url = new URL(
  '../../../assets/fonts/VT323-Regular.ttf',
  import.meta.url
);
const FontURI = url.href;

export class Scoreboard implements Representable {
  private readonly prefix: Text;
  private readonly points: Text;
  private readonly prefixText: string;
  private readonly color: number;
  private score: number;

  constructor(args: ScoreboardArgs) {
    const {
      text,
      initialScore,
      color,
    } = args;

    this.prefixText = `${text}:`;
    this.color = fromMaybe({
      maybe: color,
      fallback: 0xf0f0f0
    });
    this.score = fromMaybe({
      maybe: initialScore,
      fallback: 0
    });

    this.prefix = new Text();
    this.points = new Text();
    this.initializeText();
  }

  public addPoints(points: number): void {
    this.score += points;
  }

  public getRepresentation(): Object3D<Object3DEventMap> {
    return this.prefix;
  }

  private initializeText(): void {
    this.prefix.text = this.prefixText;
    this.prefix.anchorX = 'left';
    this.prefix.anchorY = 'top';
    this.prefix.font = FontURI;
    this.prefix.color = this.color;
    this.prefix.fontSize = 0.2;
    this.prefix.sync();

    this.points.text = this.score;
    this.points.anchorX = 'left';
    this.points.anchorY = 'top';
    this.points.font = FontURI;
    this.points.color = this.color;
    this.points.fontSize = 0.2;

    this.prefix.add(this.points);

    this.prefix.addEventListener("synccomplete", () => {
      const size = new Vector3();
      this.prefix.geometry.boundingBox.getSize(size);
      const padding = 0.02;
      const prefixWidth = size.x + padding;
  
      this.points.position.set(prefixWidth, 0, 0);
    });

  }

  public updateScore() {
    this.points.text = this.score;
  }
  
  public applyChanges(): void {
    this.points.sync();
  }

  public orientToward(point: Vector3): void {
    this.prefix.lookAt(point);
    this.points.lookAt(point);
  }

  // Getters / Setters
  public get position(): Vector3 {
    return this.prefix.position;
  }

  public get rotation(): Euler {
    return this.prefix.rotation;
  }

  public get scoreCount(): number {
    return this.score;
  }

  public set scoreCount(score: number) {
    this.score = score;
  }
}