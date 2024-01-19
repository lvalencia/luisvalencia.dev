import { Vector3, type Camera } from "three";
import { TimerBar } from "./timerBar";

interface CreateTimerBarArgs {
  camera: Camera;
}

export function createTimerBar({camera}: CreateTimerBarArgs): TimerBar {
  const timerBar = new TimerBar();

  setTimerPositionRelativeTCamera({
    timerBar,
    camera
  });

  return timerBar;
}

interface SetTimerPositionArgs {
  camera: Camera;
  timerBar: TimerBar;
}

function setTimerPositionRelativeTCamera(args: SetTimerPositionArgs): void {
  const {
    camera,
    timerBar
  } = args;

  const x = 0;
  const y = -1;
  const z = -1.2;

  const barPosition = new Vector3(x, y, z);
  barPosition.applyQuaternion(camera.quaternion);
  barPosition.add(camera.position);

  timerBar.position.copy(barPosition);
  timerBar.orientToward(camera.position);
}