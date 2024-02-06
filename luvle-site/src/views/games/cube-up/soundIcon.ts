import { degreesToRadians } from "@/helpers/degrees";
import { ClampToEdgeWrapping, Mesh, MeshStandardMaterial, PlaneGeometry, Texture, TextureLoader, type Object3D, type Object3DEventMap } from "three";
import type { Representable } from "./representable";

export function isSoundIcon(soundIcon: any): soundIcon is SoundIcon  {
  return soundIcon instanceof SoundIcon;
}

const loader = new TextureLoader();

function uriForImage(image: string) {
  const url = new URL(
      `../../../assets/images/${image}`,
      import.meta.url
    );
    return url.href;
}

export class SoundIcon implements Representable {
  private readonly on: Texture;
  private readonly off: Texture;
  private readonly material: MeshStandardMaterial;
  private readonly square: Mesh;
  private isOn: boolean;

  constructor() {
        const size = 0.40;
        const geometry = new PlaneGeometry(size, size);

        this.on = loader.load(uriForImage('sound_on.png')); 
        configureTexture(this.on);

        this.off = loader.load(uriForImage('sound_off.png')); 
        configureTexture(this.off);
    
        this.material = new MeshStandardMaterial({
          map: this.on,
          transparent: true, 
          opacity: 1 
        });
        this.isOn = true;

        this.square = new Mesh(geometry, this.material);
        configureIcon(this.square);

    
        this.square.userData = {
          object: this
        };
  }

  public getRepresentation(): Object3D<Object3DEventMap> {
    return this.square;
  }

  public toggle(): void {
    this.isOn = !this.isOn;
    this.material.map = this.isOn ? this.on : this.off;
    this.material.needsUpdate = true;
  }
}

function configureIcon(mesh: Mesh): void {
  mesh.position.x = -1.8;
  mesh.position.y = 2;
  mesh.position.z = 1.64;

  mesh.rotation.x = degreesToRadians(-70 + 360);
}

function configureTexture(texture: Texture): void {
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.repeat.set(1, 1);
  texture.offset.set(0, 0); 
}