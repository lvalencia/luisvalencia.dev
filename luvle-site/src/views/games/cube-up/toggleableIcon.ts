import { degreesToRadians } from "@/helpers/degrees";
import { ClampToEdgeWrapping, Mesh, MeshStandardMaterial, Object3D, PlaneGeometry, Texture, TextureLoader, type Object3DEventMap } from "three";
import type { Representable } from "./representable";

interface Dimensions {
  width: number;
  height: number;
}

interface ToggleableIconArgs {
  activeImage: string;
  inactiveImage: string;
  dimensions: Dimensions;
}

const loader = new TextureLoader();

function uriForImage(image: string) {
  const url = new URL(
      `../../../assets/images/${image}`,
      import.meta.url
    );
    return url.href;
}

export class ToggleableIcon implements Representable {
  protected readonly active: Texture;
  protected readonly inactive: Texture;
  protected readonly material: MeshStandardMaterial;
  protected readonly mesh: Mesh;
  protected isActive: boolean;

  constructor(args: ToggleableIconArgs)  {
    const {
      activeImage,
      inactiveImage,
      dimensions: {
        height,
        width
      }
    } = args;

    const geometry = new PlaneGeometry(width, height);

    this.active = loader.load(uriForImage(activeImage));
    configureTexture(this.active);

    this.inactive = loader.load(uriForImage(inactiveImage));
    configureTexture(this.inactive);

    this.material = new MeshStandardMaterial({
      map: this.active,
      transparent: true, 
      opacity: 1 
    });
    this.isActive = false;

    this.mesh = new Mesh(geometry, this.material);
    this.mesh.rotation.x = degreesToRadians(-70 + 360);

    this.mesh.userData = {
      object: this
    };
 }

  public getRepresentation(): Object3D<Object3DEventMap> {
    return this.mesh;
  }

  public toggle(): void {
    this.isActive = !this.isActive;
    this.material.map = this.isActive ? this.active : this.inactive;
    this.material.needsUpdate = true;
  }
}

function configureTexture(texture: Texture): void {
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.repeat.set(1, 1);
  texture.offset.set(0, 0); 
}