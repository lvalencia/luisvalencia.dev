import { fromMaybe } from "@luvle/utils";
import type { Object3D, Object3DEventMap, Vector3 } from "three";
import { Text } from "troika-three-text";
import type { Representable } from "./representable";

interface ScoreBoardArgs {
  text: string;
  initialScore?: number;
  color?: number;
}

const FontURI = 'src/assets/fonts/VT323-Regular.ttf';

export class ScoreBoard implements Representable {
  private readonly text: Text;
  private readonly prefixText: string;
  private readonly color: number;
  private score: number;

  constructor(args: ScoreBoardArgs) {
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

  public update() {
    this.text.text = this.scoreText;
    this.applyChanges();
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

  public get rotation(): Vector3 {
    return this.text.rotation;
  }

  private get scoreText(): string {
    return `${this.prefixText}: ${this.score}`;
  }
}