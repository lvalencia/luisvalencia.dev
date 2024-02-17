import type { Cube, CubeState } from "./cube";

export enum InteractionResult {
  LOST,
  POINTS,
  NO_POINTS,
}

interface InteractionResultArgs {
  cube: Cube;
  pointsState: CubeState;
  loseState: CubeState;
}

export function interactionResult(args: InteractionResultArgs): InteractionResult {
  const {
    cube,
    pointsState,
    loseState
  } = args;

  if (cube.state === loseState) {
    return InteractionResult.LOST;
  }

  if (cube.state === pointsState) {
    return InteractionResult.POINTS;
  }

  return InteractionResult.NO_POINTS;
}