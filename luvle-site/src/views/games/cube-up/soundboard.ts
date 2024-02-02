import * as howler from 'howler';

// Workaround for Rollup Issue
const { Howl } = howler;

function uriForAudio(audioFile: string): string {
  const url = new URL(
    `../../../assets/audio/${audioFile}`,
    import.meta.url
  );
  return url.href;
}

interface SoundboardArgs {
}

export class SoundBoard {
  private readonly bonk: Howl;
  private readonly plink: Howl;
  private readonly brrbrr: Howl;
  private readonly weee: Howl;

  constructor(args: SoundboardArgs = {}) {
    this.bonk = new Howl({
      src: [uriForAudio('bonk.mp3')]
    });
    this.plink = new Howl({
      src: [uriForAudio('plink.mp3')]
    });
    this.brrbrr= new Howl({
      src: [uriForAudio('brrbrr.mp3')]
    });
    this.weee= new Howl({
      src: [uriForAudio('weee.mp3')]
    });
  }
  
  public noPoints(): void {
    this.bonk.play();
  }

  public points(): void {
    this.plink.play();
  }

  public lost(): void {
    this.brrbrr.play();
  } 

  public win(): void {
    this.weee.play();
  }
}