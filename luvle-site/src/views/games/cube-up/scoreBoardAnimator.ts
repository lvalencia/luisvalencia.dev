import type { ScoreBoard } from "./scoreBoard";

export function addPoints(scoreboard: ScoreBoard, points: number): void {
  scoreboard.addPoints(points);
  renderNextTick(scoreboard);
}

export function renderNextTick(scoreboard: ScoreBoard): void {
  scoreboard.updateScore();
  scoreboard.applyChanges();
}