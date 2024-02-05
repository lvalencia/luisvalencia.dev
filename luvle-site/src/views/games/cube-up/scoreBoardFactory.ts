import { degreesToRadians } from "@/helpers/degrees";
import { ScoreBoard } from "./scoreBoard";
import type { Camera } from "three";
import type { SimpleVector } from "../shared/simpleVector";

interface CreateScoreBoardArgs {
  text: string;
  initialScore?: number;
  color?: number;
  camera: Camera;
  position?: SimpleVector;
}

const topLeft = {
  x: -1.45,
  y: 3,
  z: 0.2, 
};

export function createScoreBoard(args: CreateScoreBoardArgs): ScoreBoard {
  const {
    text,
    camera,
    initialScore,
    color,
    position: {
      x,
      y,
      z
    } = topLeft
  } = args;

  const scoreBoard = new ScoreBoard({
    text,
    initialScore,
    color,
  });

  setScoreBoardPositionRelativeToCamera({
    scoreBoard,
    camera,
    position: {
      x,
      y,
      z,
    }
  });

  scoreBoard.applyChanges();

  return scoreBoard;
}

interface SetScoreBoardPositionRelativeToCamera {
  scoreBoard: ScoreBoard;
  camera: Camera;
  position: SimpleVector;
}

function setScoreBoardPositionRelativeToCamera(args: SetScoreBoardPositionRelativeToCamera): void {
  const {
    scoreBoard,
    camera,
    position: {
      x,
      y,
      z
    }
  } = args;

  scoreBoard.position.set(x,y,z);

  /*
   * Inverse rotation of the angle of the camera;
   * Ideally, we calculate this value
   */ 
  scoreBoard.rotation.x = degreesToRadians(-70);
}