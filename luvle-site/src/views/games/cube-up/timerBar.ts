import { fromMaybe } from "@luvle/utils";
import { 
  Color, 
  MeshStandardMaterial, 
  PlaneGeometry,
  Mesh,
  Vector3,
  Object3D,
  Euler,
} from "three"; 
import type { BufferGeometry } from "three";
import type { Representable } from "./representable";
import type { SimpleVector } from "../shared/simpleVector";

interface TimerBarArgs {
  width?: number,
  height?: number
  geometry?: BufferGeometry;
  color?: Color;
  material?: MeshStandardMaterial;
  mesh?: Mesh;
}

/*
 * Note: Currently width and height are senstiive to camera FOV
 *       but not distance nor angle in degrees.
 */
export class TimerBar implements Representable {
  private readonly width: number;
  private readonly height: number;
  private readonly geometry: BufferGeometry;
  private readonly color: Color;
  private readonly material: MeshStandardMaterial;
  private readonly mesh: Mesh;

  constructor(args: TimerBarArgs = {}) {
    const {
      width,
      height,
      geometry,
      color,
      material,
      mesh
    } = args;


    this.width = fromMaybe({
      maybe: width,
      fallback: 3.5
    });

    this.height = fromMaybe({
      maybe: height,
      fallback: 0.2
    });

    this.geometry = fromMaybe({
      maybe: geometry,
      fallback: new PlaneGeometry(this.width, this.height)
    });

    this.color = fromMaybe({
      maybe: color,
      fallback: new Color(0x00ff00)
    });

    this.material = fromMaybe({
      maybe: material,
      fallback: new MeshStandardMaterial({
        color: this.color,
        emissive: this.color,
        emissiveIntensity: 0.325
      })
    });

    this.mesh = fromMaybe({
      maybe: mesh,
      fallback: new Mesh(this.geometry,  this.material)
    })
  }

  public orientToward(point: Vector3): void {
    this.mesh.lookAt(point);
  }

  public scaleX(percentage: number): void {
    const clampedPercentage = Math.max(0, Math.min(1, percentage));
    this.mesh.scale.x = clampedPercentage;
  }

  public getRepresentation(): Object3D {
    return this.mesh;
  }

  // Getters / Setters
  public get position(): Vector3 {
    return this.mesh.position;
  }

  public set position({x,y,z}: SimpleVector) {
    this.mesh.position.set(x,y,z);
  }

  public get rotation(): Euler {
    return this.mesh.rotation;
  }

  public set barColor(color: number) {
    this.material.color.set(color);
    this.material.emissive.set(color);
  }

  public get barColor(): number {
    return this.material.color.getHex();
  }
}
