import { Cube } from "./cube";
import { Edge } from "./edges";

interface CreateCubeArgs {
  rows: number[];
}

export function createCubes({ rows }: CreateCubeArgs): Cube[] {
  const cubes: Cube[] = [];

  rows.forEach((cubesInRow, currentRowIndex) => {
    for (let i = 0; i < cubesInRow; i++) {
      const cube = new Cube();

      setCubePosition({
        cube,
        currentRow: currentRowIndex,
        positionInRow: i,
        cubesInRow,
        totalNumberOfRows: rows.length,
      });

      stylizeCube(cube);

      cubes.push(cube);
    }
  });

  return cubes;
}

interface CubePoisitionArgs {
  cube: Cube;
  currentRow: number;
  positionInRow: number;
  cubesInRow: number;
  totalNumberOfRows: number;
}

function setCubePosition(args: CubePoisitionArgs): void {
  const { cube, currentRow, positionInRow, cubesInRow, totalNumberOfRows } =
    args;

  const cubeSize = cube.cubeSize;
  const cubeGap = cubeSize / 5.0;
  const cubeSpacing = cubeSize + cubeGap;

  const x = positionInRow * cubeSpacing - ((cubesInRow - 1) * cubeSpacing) / 2;
  const y = 0;
  const z =
    currentRow * cubeSpacing - ((totalNumberOfRows - 1) * cubeSpacing) / 2;

  cube.position = {
    x,
    y,
    z,
  };
}
const jitterIntensity = 0.2;
function stylizeCube(cube: Cube): void {
  // Add Jitter
  cube.rotation.x = Math.random() * jitterIntensity - 0.1;
  cube.rotation.y = Math.random() * jitterIntensity - 0.1;

  cube.position.x += Math.random() * jitterIntensity - 0.1;
  cube.position.z += Math.random() * jitterIntensity - 0.1;

  // Allow shadows
  cube.enableShadows();

  // Add Edges
  const edges = new Edge({
    geometry: cube.getGeometry(),
  });
  cube.addEdges(edges);
}

