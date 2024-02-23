import { Vector3 } from "three";
import type { Scoreboard } from "./scoreboard";

export function addPoints(scoreboard: Scoreboard, points: number): void {
  scoreboard.addPoints(points);
  aninmatePoints(scoreboard);
  renderNextTick(scoreboard);
}

export function renderNextTick(scoreboard: Scoreboard): void {
  scoreboard.updateScore();
  scoreboard.applyChanges();
}

const POINTS_ANIMATION_INTERVAL = 25;
const POINTS_ANIMATION_DURATION = 100;

const animating: Record<string, { action: () => void, interval: number, timeout: number }> = {};

function aninmatePoints(scoreboard: Scoreboard): void {
  if (animating.hasOwnProperty(scoreboard.id)) {
    const {
      action,
      interval,
      timeout
    } = animating[scoreboard.id];
    clearInterval(interval);
    clearTimeout(timeout);
    action();
  }

  const {
    x,y,z
  } = scoreboard.pointsPosition;
  const originalPosition = new Vector3(x,y,z);

  scoreboard.pointsPosition.set(x, y, z - 0.02);
  const interval = setInterval(() => {
    scoreboard.pointsPosition.lerp(originalPosition, 0.01);
  }, POINTS_ANIMATION_INTERVAL);

  const resetAnimation = () => {
    clearInterval(interval);
    delete animating[scoreboard.id];
    scoreboard.pointsPosition = originalPosition;
  };

  const timeout = setTimeout(resetAnimation, POINTS_ANIMATION_DURATION);

  animating[scoreboard.id] = {
    interval: interval as unknown as number,
    timeout: timeout as unknown as number,
    action: resetAnimation
  }
}