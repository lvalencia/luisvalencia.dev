import { fromMaybe } from "@luvle/utils";
import { 
  Color, 
  MeshStandardMaterial, 
  PlaneGeometry,
  Mesh,
  Vector3,
  Object3D,
} from "three"; 
import type { BufferGeometry, Material } from "three";
import type { Representable } from "./representable";

interface TimerBarArgs {
  width?: number,
  height?: number
  geometry?: BufferGeometry;
  color?: Color;
  material?: Material;
  mesh?: Mesh;
}

/*
 * Note: Currently width and height are senstiive to camera FOV
 * .     but not distance nor angle in degrees.
 */
export class TimerBar implements Representable {
  private readonly width: number;
  private readonly height: number;
  private readonly geometry: BufferGeometry;
  private readonly color: Color;
  private readonly material: Material;
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
        color: this.color
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

  public getRepresentation(): Object3D {
    return this.mesh;
  }

  // Getters / Setters
  public get position(): Vector3 {
    return this.mesh.position;
  }

}
