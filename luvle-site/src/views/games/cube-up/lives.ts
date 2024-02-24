import { 
  ClampToEdgeWrapping, 
  Euler, 
  Mesh, 
  MeshStandardMaterial, 
  Object3D, 
  PlaneGeometry, 
  Texture, 
  TextureLoader, 
  Vector3, 
  type Object3DEventMap
} from "three";
import { Text } from "troika-three-text";
import type { Representable } from "./representable";

interface LivesArgs {
  amount: number;
  dimensions?: {
    width: number;
    height: number;
  },
  happyImage: string;
  worriedImage: string;
  sadImage: string;
  deadImage: string;
}

const url = new URL(
  '../../../assets/fonts/VT323-Regular.ttf',
  import.meta.url
);
const FontURI = url.href;

function uriForImage(image: string) {
  const url = new URL(
      `../../../assets/images/${image}`,
      import.meta.url
    );
    return url.href;
}

const loader = new TextureLoader();

export class Lives implements Representable {
  private readonly happy: Texture;
  private readonly worried: Texture;
  private readonly sad: Texture;
  private readonly dead: Texture;

  private readonly text: Text;
  private readonly mesh: Mesh;
  private readonly imageMaterial: MeshStandardMaterial;
  private amount: number;
  private opaque: boolean = true;
  private animating: Record<string, {interval: number, timeout: number}> = {};

  constructor(args: LivesArgs) {
    const size = 0.32;
    const {
      amount,
      happyImage,
      worriedImage,
      sadImage,
      deadImage,
      dimensions: {
        width,
        height
      } = {
        width: size,
        height: size
      }
    } = args;
    this.amount = amount;

    const geometry = new PlaneGeometry(width, height);

    this.happy = loader.load(uriForImage(happyImage));
    configureTexture(this.happy);
    this.worried = loader.load(uriForImage(worriedImage));
    configureTexture(this.worried);
    this.sad = loader.load(uriForImage(sadImage));
    configureTexture(this.sad);
    this.dead = loader.load(uriForImage(deadImage));
    configureTexture(this.dead);

    this.imageMaterial = new MeshStandardMaterial({
      map: this.currentTexture,
      transparent: true,
      opacity: 1
    });

    this.mesh = new Mesh(geometry, this.imageMaterial);

    this.text = new Text();
    this.text.text = `x${amount}`;
    this.text.anchorX = 'left';
    this.text.anchorY = 'middle';
    this.text.font = FontURI;
    this.text.color = 0x9966FF
    this.text.fontSize = 0.32;
    this.text.position.set(0.16,-0.05,0);
    this.text.sync();

    this.mesh.add(this.text);
  }

  public setLivesTo(amount: number) {
    this.amount = amount;
    this.text.text = `x${this.amount}`;
    this.text.sync();

    this.imageMaterial.map = this.currentTexture;
  }

  public toggleOpacity(): void {
    this.opaque = !this.opaque;
    const opacity = this.opaque ? 1 : 0.6;
    this.imageMaterial.opacity = opacity;
    this.text.fillOpacity = opacity;
  }

  public visible(): void {
    this.imageMaterial.opacity = 1;
    this.text.fillOpacity = 1;
  }

  public getRepresentation(): Object3D<Object3DEventMap> {
    return this.mesh;
  }

  public get rotation(): Euler {
    return this.mesh.rotation;
  }

  public get position(): Vector3 {
    return this.mesh.position;
  }

  private get currentTexture(): Texture {
    const lives = this.amount;
    if(lives >= 3) return this.happy;
    if(lives >= 2) return this.worried;
    if(lives >= 1) return this.sad;
    return this.dead;
  }
}

function configureTexture(texture: Texture): void {
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.repeat.set(1, 1);
  texture.offset.set(0, 0); 
}
