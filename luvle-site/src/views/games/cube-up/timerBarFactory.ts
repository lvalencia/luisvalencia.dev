import { degreesToRadians } from "@/helpers/degrees";
import { Vector3, type Camera } from "three";
import type { SimpleVector } from "../shared/simpleVector";
import { TimerBar } from "./timerBar";

interface CreateTimerBarArgs {
  camera: Camera;
}

export function createTimerBar({camera}: CreateTimerBarArgs): TimerBar {
  const timerBar = new TimerBar();

  setTimerPositionRelativeToCamera({
    timerBar,
    camera,
    position: {
      x: 0,
      y: -1,
      z: -1.24
    }
  });

  return timerBar;
}

interface SetTimerPositionArgs {
  position: SimpleVector;
  camera: Camera;
  timerBar: TimerBar;
}

function setTimerPositionRelativeToCamera(args: SetTimerPositionArgs): void {
  const {
    camera,
    timerBar,
    position: {
      x,
      y,
      z
    }
  } = args;

  const barPosition = new Vector3(x, y , z);
  barPosition.applyQuaternion(camera.quaternion);
  barPosition.add(camera.position);

  timerBar.position.copy(barPosition);
  timerBar.rotation.x = degreesToRadians(-70);
}