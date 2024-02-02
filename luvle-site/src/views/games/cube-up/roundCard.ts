import { degreesToRadians } from "@/helpers/degrees";
import { fromMaybe } from "@luvle/utils";
import { Mesh, MeshPhysicalMaterial, PlaneGeometry, type Object3D, type Object3DEventMap } from "three";
import { Text } from "troika-three-text";
import type { Representable } from "./representable";

export interface RoundContent {
  title?: string;
  instructions?: string;
}

interface RoundCardArgs extends RoundContent {
  color?: number;
}

const url = new URL(
  '../../../assets/fonts/VT323-Regular.ttf',
  import.meta.url
);
const FontURI = url.href;


export class RoundCard implements Representable {
  private readonly blurMaterial: MeshPhysicalMaterial;
  private readonly blur: Mesh;
  private readonly color: number;
  private title: Text;
  private instructions: Text;

  constructor(args: RoundCardArgs) {
    const {
      title,
      instructions, 
      color
    } = args;

    this.color = fromMaybe({
      maybe: color,
      fallback: 0x0,
    });

    const baseStyle = {
      fontSize: 1,
      color: this.color,
      font: FontURI
    }


    this.title = new Text();
    styleText(this.title, {
      ...baseStyle,
      content: fromMaybe({
        maybe: title,
        fallback: 'lorem ipsum'
      })
    });
    this.title.rotation.x = degreesToRadians(-70);
    this.title.position.set(-1.25, 1.6, 0);

    const width = 8;
    const height = 5;
    this.blurMaterial = new MeshPhysicalMaterial({
      transmission: 1,
      roughness: 0.4,
      color: 0xA9A9A9
    })
    this.blur = new Mesh(
      new PlaneGeometry(width, height),
      this.blurMaterial
    );
    this.title.add(this.blur);
    this.blur.position.set(1.25, -0.68125, -0.05);

    this.instructions = new Text();
    styleText(this.instructions, {
      ...baseStyle,
      fontSize: 0.5,
      content: fromMaybe({
        maybe:instructions,
        fallback: 'dolor sit amet, consectetur'
      })
    });

    this.title.add(this.instructions);
    this.instructions.position.set(-0.45, -0.8, 0);

    this.blurMaterial.transparent = true;
  }

  public hide(): void {
    this.title.fillOpacity = 0;
    this.blurMaterial.opacity = 0;
    this.instructions.fillOpacity = 0;
  }

  public show(): void {
    this.title.fillOpacity = 1;
    this.blurMaterial.opacity = 1;
    this.instructions.fillOpacity = 1;
  }

  public updateContent({title, instructions}: RoundContent) {
    this.title.text = title;
    this.title.sync();
    this.instructions.text = instructions;
    this.instructions.sync();
  }

  public getRepresentation(): Object3D<Object3DEventMap> {
    return this.title;
  }

  get visible(): boolean {
    return this.title.fillOpacity != 0;
  }
}

interface TextStyle {
  font: string;
  fontSize: number;
  color: number;
  content: string;
}

function styleText(text: Text, style: TextStyle): void {
  const {
    font,
    fontSize,
    color,
    content
  } = style;

  text.text = content;
  text.font = font;
  text.color = color;
  text.fontSize = fontSize;
}