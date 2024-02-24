import { Vector3 } from "three";
import { degreesToRadians } from "@/helpers/degrees";
import { Points } from "./points";
import { addToScene, removeFromScene } from "./scene";
import type { Scene } from "three";
import type { Scoreboard } from "./scoreboard";

interface AddPointsArgs {
  scoreboard: Scoreboard;
  points: number;
  scene: Scene;
  color?: number;
}

export function addPoints(args: AddPointsArgs): void {
  const {
    scoreboard,
    points,
    color,
    scene
  } = args;

  scoreboard.addPoints(points);
  animatePoints(points, scene, color);
  animateScoreboard(scoreboard);
  renderNextTick(scoreboard);
}

export function renderNextTick(scoreboard: Scoreboard): void {
  scoreboard.updateScore();
  scoreboard.applyChanges();
}

const POINTS_ANIMATION_INTERVAL = 25;
const POINTS_ANIMATION_DURATION = 1600;
const STEP = 1 / (POINTS_ANIMATION_DURATION / POINTS_ANIMATION_INTERVAL);

const POINTS_VECTOR_2 = {
  x: 2.5,
  y: 1.6
}

function animatePoints(value: number, scene: Scene, color?: number) {
  console.log(`color: ${color}`);
  const points = new Points({
    points: value,
    color,
  });

  const {
    x,
    y
  } = POINTS_VECTOR_2;

  points.position.set(x, y, 0.4);
  const scale = mapToBounds({
    value,
    minScale: 1,
    maxScale: 1.4,
    minScore: 50,
    maxScore: 500
  });
  points.scale.set(scale, scale, scale);
  points.rotation.x = degreesToRadians(-70);
  addToScene(points, scene);

  const endPosition = new Vector3(x + 0.32, y, -1);

  const interval = setInterval(() => {
    points.position.lerp(endPosition, STEP);
    points.opacity -= STEP;
  }, POINTS_ANIMATION_INTERVAL);

  setTimeout(() => {
    clearInterval(interval);
    removeFromScene(points, scene);
    points.destroy();
  }, POINTS_ANIMATION_DURATION);
}

const SCOREBOARD_ANIMATION_INTERVAL = 25;
const SCOREBOARD_ANIMATION_DURATION = 100;

const animating: Record<string, { action: () => void, interval: number, timeout: number }> = {};

function animateScoreboard(scoreboard: Scoreboard): void {
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
  }, SCOREBOARD_ANIMATION_INTERVAL);

  const resetAnimation = () => {
    clearInterval(interval);
    delete animating[scoreboard.id];
    scoreboard.pointsPosition = originalPosition;
  };

  const timeout = setTimeout(resetAnimation, SCOREBOARD_ANIMATION_DURATION);

  animating[scoreboard.id] = {
    interval: interval as unknown as number,
    timeout: timeout as unknown as number,
    action: resetAnimation
  }
}

interface MapToBoundsArgs {
  value: number;
  minScale: number;
  maxScale: number;
  minScore: number;
  maxScore: number;
}

function mapToBounds(args: MapToBoundsArgs): number {
  const {
    value,
    minScale,
    maxScale,
    minScore,
    maxScore,
  } = args;

  const start = minScale;
  const end = maxScale;
  const t = (value - minScore) / (maxScore - minScore);
  return (1 - t) * start + t * end;
}