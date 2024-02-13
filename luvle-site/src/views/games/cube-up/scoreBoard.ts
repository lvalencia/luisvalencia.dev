import { fromMaybe } from "@luvle/utils";
import { Text } from "troika-three-text";
import type { Representable } from "./representable";
import type { Euler, Object3D, Object3DEventMap, Vector3 } from "three";

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
  private readonly text: Text;
  private readonly prefixText: string;
  private readonly color: number;
  private score: number;

  constructor(args: ScoreboardArgs) {
    const {
      text,
      initialScore,
      color
    } = args;

    this.prefixText = text;
    this.color = fromMaybe({
      maybe: color,
      fallback: 0xf0f0f0
    });
    this.score = fromMaybe({
      maybe: initialScore,
      fallback: 0
    });

    this.text = new Text();
    this.initializeText();
  }

  public addPoints(points: number): void {
    this.score += points;
  }

  public getRepresentation(): Object3D<Object3DEventMap> {
    return this.text;
  }

  private initializeText(): void {
    this.text.text = this.scoreText;
    this.text.font = FontURI;
    this.text.color = this.color;
    this.text.fontSize = 0.2;
  }

  public updateScore() {
    this.text.text = this.scoreText;
  }
  
  public applyChanges(): void {
    this.text.sync();
  }

  public orientToward(point: Vector3): void {
    this.text.lookAt(point);
  }

  // Getters / Setters
  public get position(): Vector3 {
    return this.text.position;
  }

  public get rotation(): Euler {
    return this.text.rotation;
  }

  public get scoreCount(): number {
    return this.score;
  }

  public set scoreCount(score: number) {
    this.score = score;
  }

  private get scoreText(): string {
    return `${this.prefixText}:${this.score}`;
  }
}