import { degreesToRadians } from "@/helpers/degrees";
import { Lives } from "./lives";

export function createLives(numberOfLives: number): Lives {
  const lives = new Lives({
    amount: numberOfLives,
    happyImage: 'happy.png',
    sadImage: 'sad.png',
    worriedImage: 'worried.png',
    deadImage: 'dead.png',
  });

  lives.position.set(-2.04,2.4,0.2);
  lives.rotation.x = degreesToRadians(-70);

  return lives;
}