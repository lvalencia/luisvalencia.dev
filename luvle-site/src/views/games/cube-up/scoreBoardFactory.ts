import { degreesToRadians } from "@/helpers/degrees";
import { Scoreboard } from "./scoreboard";
import type { Camera } from "three";
import type { SimpleVector } from "../shared/simpleVector";

interface CreateScoreboardArgs {
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

export function createScoreboard(args: CreateScoreboardArgs): Scoreboard {
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

  const scoreboard = new Scoreboard({
    text,
    initialScore,
    color,
  });

  setScoreboardPositionRelativeToCamera({
    scoreboard,
    camera,
    position: {
      x,
      y,
      z,
    }
  });

  scoreboard.applyChanges();

  return scoreboard;
}

interface SetScoreboardPositionRelativeToCamera {
  scoreboard: Scoreboard;
  camera: Camera;
  position: SimpleVector;
}

function setScoreboardPositionRelativeToCamera(args: SetScoreboardPositionRelativeToCamera): void {
  const {
    scoreboard,
    camera,
    position: {
      x,
      y,
      z
    }
  } = args;

  scoreboard.position.set(x,y,z);

  /*
   * Inverse rotation of the angle of the camera;
   * Ideally, we calculate this value
   */ 
  scoreboard.rotation.x = degreesToRadians(-70);
}