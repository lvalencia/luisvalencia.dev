import { fromMaybe } from "@luvle/utils";
import type { ScoreBoard } from "./scoreBoard";

interface ScoreBoardAnimatorArgs {
  scoreBoard: ScoreBoard;
}

export class ScoreBoardAnimator {
  private readonly scoreBoard: ScoreBoard;

  constructor(args: ScoreBoardAnimatorArgs) {
    const {
      scoreBoard,
    } = args;

    this.scoreBoard = scoreBoard;
  }

  public addPoints(points: number): void {
    this.scoreBoard.addPoints(points);
    this.scoreBoard.updateScore();
    this.scoreBoard.applyChanges();
  }

}