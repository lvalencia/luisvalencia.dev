import { degreesToRadians } from "@/helpers/degrees";
import { Vector3, type Camera } from "three";
import { ScoreBoard } from "./scoreBoard";

interface CreateScoreBoardArgs {
  text: string;
  initialScore?: number;
  color?: number;
  camera: Camera
}

export function createScoreBoard(args: CreateScoreBoardArgs): ScoreBoard {
  const {
    text,
    camera,
    initialScore,
    color,
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
      x: -1.45,
      y: 3,
      z: 0.2,
    }
  });

  scoreBoard.applyChanges();

  return scoreBoard;
}

interface SimplePosition {
  x: number;
  y: number;
  z: number;
}

interface SetScoreBoardPositionRelativeToCamera {
  scoreBoard: ScoreBoard;
  camera: Camera;
  position: SimplePosition;
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