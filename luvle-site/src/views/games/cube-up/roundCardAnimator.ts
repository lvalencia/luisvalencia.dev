import type { RoundCard, RoundContent } from "./roundCard";

const Rounds: RoundContent[] = [
  {
    title: 'Round 1',
    instructions: 'Hit all the greens!',
  },
  {
    title: 'Round 2',
    instructions: 'Beware the changes!',
  },
  {
    title: 'Round 3',
    instructions: 'Scramble!'
  },
]

interface RoundCardAnimatorArgs {
  roundCard: RoundCard;
}

export class RoundCardAnimator {
  private readonly roundCard: RoundCard;
  private round: number = 0;

  constructor(args: RoundCardAnimatorArgs) {
    const {
      roundCard
    } = args;
    this.roundCard = roundCard;
  }

  public nextRound(): void {
    this.roundCard.updateContent(Rounds[this.round]);
    this.roundCard.show();
    this.round++;
  }

  public startOver(): void {
    this.round = 0;
    this.nextRound();
  }
}