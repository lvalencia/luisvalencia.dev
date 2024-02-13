import type { Scoreboard } from "./scoreboard";

export function addPoints(scoreboard: Scoreboard, points: number): void {
  scoreboard.addPoints(points);
  renderNextTick(scoreboard);
}

export function renderNextTick(scoreboard: Scoreboard): void {
  scoreboard.updateScore();
  scoreboard.applyChanges();
}