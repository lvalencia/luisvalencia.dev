import { Vector3, type Camera } from "three";
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
      z: -1.2
    }
  });

  return timerBar;
}

interface SimplePosition {
  x: number;
  y: number;
  z: number;
}
interface SetTimerPositionArgs {
  position: SimplePosition;
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

  const barPosition = new Vector3(x, y, z);
  barPosition.applyQuaternion(camera.quaternion);
  barPosition.add(camera.position);

  timerBar.position.copy(barPosition);
  timerBar.orientToward(camera.position);
}