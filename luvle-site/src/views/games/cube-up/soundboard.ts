import { selectRandomFrom } from '@/helpers/random';
import * as howler from 'howler';  // Workaround for Rollup Issue

function uriForAudio(audioFile: string): string {
  const url = new URL(
    `../../../assets/audio/${audioFile}`,
    import.meta.url
  );
  return url.href;
}

interface Playable {
  play(input?: any): any;
}

interface Stoppable {
  stop(input?: any): any;
}

type Controllable = Playable & Stoppable;

interface SoundboardArgs {
}

export class SoundBoard {
  private readonly winEffect: Controllable;
  private readonly loseEffect: Controllable;
  private readonly pointsEffet: Controllable;
  private readonly noPointsEffet: Controllable;
  private readonly wind: Controllable;
  private readonly bumbumbumbum: Controllable;

  constructor(args: SoundboardArgs = {}) {
    this.winEffect = new Randomizer({
      tracks: [
        new Howl({
          src: [uriForAudio('weee.mp3')]
        }),
        new Howl({
          src: [uriForAudio('awwyee.mp3')]
        }),
      ]
    });

    this.loseEffect = new Randomizer({
      tracks: [
        new Howl({
          src: [uriForAudio('brrbrr.mp3')]
        }),
        new Howl({
          src: [uriForAudio('yousuck.mp3')]
        }),
        new Howl({
          src: [uriForAudio('getrekt.mp3')]
        }),
      ]
    });

    this.pointsEffet = new Randomizer({
      tracks: [
        new Howl({
          src: [uriForAudio('bink.mp3')]
        }),
        new Howl({
          src: [uriForAudio('tink.mp3')]
        }),
        new Howl({
          src: [uriForAudio('plink.mp3')]
        }),
      ]
    });

    this.wind = new Looper({
      tracks: [
        new Howl({
          src: [uriForAudio('wind.mp3')],
        }),
        new Howl({
          src: [uriForAudio('wind2.mp3')],
        }),
        new Howl({
          src: [uriForAudio('wind3.mp3')],
        })
      ]
    });

    this.pointsEffet = new Randomizer({
      tracks: [
        new Howl({
          src: [uriForAudio('bink.mp3')]
        }),
        new Howl({
          src: [uriForAudio('tink.mp3')]
        }),
        new Howl({
          src: [uriForAudio('plink.mp3')]
        }),
      ]
    });

    this.noPointsEffet = new Randomizer({
      tracks: [
        new Howl({
          src: [uriForAudio('bonk.mp3')]
        }),
        new Howl({
          src: [uriForAudio('honk.mp3')]
        }),
      ]
    });

    this.bumbumbumbum = new Howl({
      src: [uriForAudio('bumbumbumbum.mp3')],
      loop: true,
    })
  }
  
  public noPoints(): void {
    this.noPointsEffet.play();
  }

  public points(): void {
    this.pointsEffet.play();
  }

  public lost(): void {
    this.loseEffect.play();
  } 

  public win(): void {
    this.winEffect.play();
  }

  public startWind(): void {
    this.wind.play();
  }
  
  public stopWind(): void {
    this.wind.stop();
  }

  public startRoundBackground(): void {
    this.bumbumbumbum.play();
  }

  public stopRoundBackground(): void {
    this.bumbumbumbum.stop();
  }
}

interface PlayableStoppableArgs {
  tracks: Howl[];
}

class Randomizer implements Playable, Stoppable {
  private readonly tracks: Howl[];
  private currentTrack: Howl;

  constructor(args: PlayableStoppableArgs) {
    const {
      tracks
    } = args;
    this.tracks = tracks;
    this.currentTrack = selectRandomFrom(this.tracks);
  }

  public play() {
    this.currentTrack = selectRandomFrom(this.tracks);
    this.currentTrack.play();
  }

  public stop() {
    this.currentTrack.stop();
  }
}

class Looper implements Playable, Stoppable {
  private readonly tracks: Howl[];
  private currentTrack: Howl;
  private loopTracks: boolean = true;

  constructor(args: PlayableStoppableArgs) {
    const {
      tracks
    } = args;
    this.tracks = tracks;
    this.tracks.forEach((track: Howl) => {
      track.on("end", () => {
        this.nextTrack();
      })
    });
    this.currentTrack = selectRandomFrom(this.tracks);
  }

  public play() {
    this.loopTracks = true;
    this.currentTrack.play();
  }

  public stop() {
    this.loopTracks = false;
    this.currentTrack.stop();
  }

  private nextTrack() {
    if (this.loopTracks) {
      this.currentTrack = selectRandomFrom(this.tracks);
      this.currentTrack.play();
    }
  }
}