import { fromMaybe } from "@luvle/utils";
import { Color, EdgesGeometry, LineBasicMaterial, LineSegments, Object3D, type BufferGeometry, type Line, type Material } from "three";

interface EdgeArgs {
  geometry: BufferGeometry;
  edges?: BufferGeometry;
  color?: Color;
  material?: Material;
  line?: Line;
}

export class Edge {
  private readonly geometry: BufferGeometry;
  private readonly color: Color;
  private readonly edges: BufferGeometry;
  private readonly material: Material;
  private readonly line: Line;

  constructor(args: EdgeArgs) {
    const {
      geometry,
      color,
      edges,
      material,
      line
    } = args;

    this.geometry = geometry;

    this.edges = fromMaybe({
      maybe: edges,
      fallback: new EdgesGeometry(geometry)
    });

    this.color = fromMaybe({
      maybe: color,
      fallback: new Color(0xffffff)
    });

    this.material = fromMaybe({
      maybe: material,
      fallback: new LineBasicMaterial({
        color: this.color
      })
    });

    this.line = fromMaybe({
      maybe: line,
      fallback: new LineSegments(this.edges, this.material)
    });
  }

  public getRepresentation(): Object3D {
    return this.line;
  }
}
