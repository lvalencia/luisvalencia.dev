import type { LevelCard, LevelContent } from "./levelCard";

interface LevelCardAnimatorArgs {
  levelCard: LevelCard;
}

export class LevelCardAnimator {
  private readonly levelCard: LevelCard;

  constructor(args: LevelCardAnimatorArgs) {
    const {
      levelCard,
    } = args;
    this.levelCard = levelCard;
  }

  public updateContentAndShow(content: LevelContent) {
    this.levelCard.updateContent(content);
    this.levelCard.show();
  }
}