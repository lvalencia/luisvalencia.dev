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
  public readonly id: string;
  private readonly prefix: Text;
  private readonly points: Text;
  private readonly color: number;
  private score: number;

  constructor(args: ScoreboardArgs) {
    this.id = crypto.randomUUID();
    
    const {
      text,
      initialScore,
      color,
    } = args;

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
    this.initializeText(text);
  }

  public addPoints(points: number): void {
    this.score += points;
  }

  public getRepresentation(): Object3D<Object3DEventMap> {
    return this.prefix;
  }

  private initializeText(prefixText: string): void {
    this.prefix.text = prefixText;
    this.prefix.anchorX = 'left';
    this.prefix.anchorY = 'top';
    this.prefix.font = FontURI;
    this.prefix.color = this.color;
    this.prefix.fontSize = 0.2;
    this.prefix.sync();

    this.points.text = `${this.score}`;
    this.points.anchorX = 'left';
    this.points.anchorY = 'top';
    this.points.font = FontURI;
    this.points.color = this.color;
    this.points.fontSize = 0.2;

    this.prefix.add(this.points);

    this.prefix.addEventListener("synccomplete", () => {
      const size = new Vector3();
      (this.prefix as any).geometry.boundingBox.getSize(size);
      const padding = 0.02;
      const prefixWidth = size.x + padding;
  
      this.points.position.set(prefixWidth, 0, 0);
    });

  }

  public updateScore() {
    this.points.text = `${this.score}`;
  }

  public updatePrefix(text: string) {
    this.prefix.text = text;
    this.prefix.sync();
  }
  
  public applyChanges(): void {
    this.points.sync();
  }

  // Getters / Setters
  public get position(): Vector3 {
    return this.prefix.position;
  }

  public get pointsPosition():  Vector3 {
    return this.points.position;
  }

  public set pointsPosition({x,y,z}: Vector3) {
    this.points.position.set(x,y,z);
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

  public get currentScore(): number {
    return this.score;
  }
}