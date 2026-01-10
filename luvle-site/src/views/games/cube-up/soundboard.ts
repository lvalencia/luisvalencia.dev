import { selectRandomFrom } from '@/helpers/random';
import { fromMaybe, isSomething } from '@luvle/utils';
import * as howler from 'howler';  // Workaround for Rollup Issue

interface Playable {
  play(input?: any): any;
}

interface Stoppable {
  stop(input?: any): any;
}

interface Hookable {
  on(
    event: "end",
    callback: (input: any) => void,
    input?: any,
  ): any;
}

interface Adjustable {
  volume(): number;
  volume(volume: number): number;
}

type Controllable = Playable & Stoppable & Hookable & Adjustable;

interface SoundboardArgs {
  silenced?: boolean;
}

function uriForAudio(audioFile: string): string {
  const url = new URL(
   `../../../assets/audio/${audioFile}`,
    import.meta.url
  );
  return url.href;
}

export class SoundBoard {
  private readonly winEffect: Silenceable;
  private readonly loseEffect: Silenceable;
  private readonly pointsEffect: Silenceable;
  private readonly pointsEffectHeavy: Silenceable;
  private readonly noPointsEffect: Silenceable;
  private readonly wind: Silenceable;
  private readonly backgroundMusic: Silenceable;
  private readonly gameOverEffect: Silenceable;
  private readonly beatGameEffect: Silenceable;
  private isHeavy: boolean = false;

  constructor(args: SoundboardArgs = {}) {
    const {
      silenced
    } = args;

    const isSilent = fromMaybe({
      maybe: silenced,
      fallback: false
    });

    this.winEffect = new Silenceable({
      silenced: isSilent,
      track: new Randomizer({
        tracks: [
          new Howl({
            src: [uriForAudio('weee.mp3')]
          }),
          new Howl({
            src: [uriForAudio('awwyee.mp3')]
          }),
          new Howl({
            src: [uriForAudio('naes.mp3')]
          }),
        ]
      })
    });

    this.loseEffect = new Silenceable({
      silenced: isSilent,
      track: new Randomizer({
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
          new Howl({
            src: [uriForAudio('pewuweuweu.mp3')]
          }),
        ]
      })
    });

    this.gameOverEffect = new Silenceable({
      silenced: isSilent,
      track: new Howl({
        src: [uriForAudio('wuawuawuaa.mp3')]
      })
    });

    this.beatGameEffect = new Silenceable({
      silenced: isSilent,
      track: new Howl({
        src: [uriForAudio('bumbumpbumpba.mp3')]
      })
    });

    this.pointsEffect = new Silenceable({
      silenced: isSilent,
        track: new Randomizer({
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
      })
    });

    this.pointsEffectHeavy = new Silenceable({
      silenced: isSilent,
      track: new Randomizer({
        tracks: [
          new Howl({
            src: [uriForAudio('bonk.mp3')]
          }),
          new Howl({
            src: [uriForAudio('tonk.mp3')]
          }),
          new Howl({
            src: [uriForAudio('plonk.mp3')]
          }),
        ]
      })
    });

    this.noPointsEffect = new Silenceable({
      silenced: isSilent,
      track: new Randomizer({
        tracks: [
          new Howl({
            src: [uriForAudio('derp.mp3')]
          }),
          new Howl({
            src: [uriForAudio('no.mp3')]
          }),
          new Howl({
            src: [uriForAudio('quitIt.mp3')]
          }),
        ]
      }),
    });

    this.wind = new Silenceable({
      silenced: isSilent,
      track: new Looper({
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
      })
    });

    this.backgroundMusic = new Silenceable({
      silenced: isSilent,
      track: new Howl({
        src: [uriForAudio('bumbumbumbum.mp3')],
        loop: true,
      }),
    });
  }

  public stop(): void {
    this.winEffect.stop();
    this.loseEffect.stop();
    this.pointsEffect.stop();
    this.noPointsEffect.stop();
    this.wind.stop();
    this.backgroundMusic.stop();
  }
  
  public noPoints(): void {
    this.noPointsEffect.play();
  }

  public points(): void {
    if (this.isHeavy) {
      this.pointsEffectHeavy.play();
      return;
    }
    this.pointsEffect.play();
  }

  public lost(): void {
    this.loseEffect.play();
  } 

  public win(): void {
    this.winEffect.play();
  }

  public gameOver(): void {
    this.gameOverEffect.play();
  }

  public beatGame(): void {
    this.beatGameEffect.play();
  }

  public startWind(): void {
    this.wind.play();
  }
  
  public stopWind(): void {
    this.wind.stop();
  }

  public startLevelBackground(): void {
    this.backgroundMusic.play();
  }

  public stopLevelBackground(): void {
    this.backgroundMusic.stop();
  }
  
  public setIsHeavy(isHeavy: boolean): void {
    this.isHeavy = isHeavy;
  }

  public get silenced(): boolean {
    return this.winEffect.silenced &&
    this.loseEffect.silenced &&
    this.pointsEffect.silenced &&
    this.pointsEffectHeavy.silenced &&
    this.noPointsEffect.silenced &&
    this.wind.silenced &&
    this.backgroundMusic.silenced;
  }

  public set silenced(silenced: boolean) {
    this.winEffect.silenced = silenced;
    this.loseEffect.silenced = silenced;
    this.pointsEffect.silenced = silenced;
    this.pointsEffectHeavy.silenced = silenced;
    this.noPointsEffect.silenced = silenced;
    this.wind.silenced = silenced;
    this.backgroundMusic.silenced = silenced;
  }
}

type ControllableArgs = {
  tracks: Controllable[];
  track?: never;
} | { 
  track: Controllable, 
  tracks?: never 
};

abstract class BaseControllable implements Controllable {
  protected readonly tracks: Controllable[];
  protected currentTrack: Controllable;

  constructor(args: ControllableArgs) {
    const {
      tracks,
      track
    } = args;

    if (isSomething(tracks)) {
      this.tracks = tracks
      this.currentTrack = this.tracks[0]!;
      
      return;
    }

    if (isSomething(track)) {
      this.tracks = [track];
      this.currentTrack = track;

      return;
    }

    throw Error(`Invalid Inputs for Controllable a Track or Various tracks muts be defined`);
  }

  public volume(volume?: number): number {
    if (isSomething(volume)) {
      // Apply Volume to All Tracks
      this.tracks.forEach((track) => {
        track.volume(volume)
      });
    }

    // Default to Returning Current Track Volume
    return this.currentTrack.volume();
  }

  public play(): any {
    this.currentTrack.play();
  }

  public stop(): any {
    this.currentTrack.stop();
  }

  public on(event: 'end', callback: (input: any) => void, input?: any) {
    this.tracks.forEach((track: Controllable) => {
      track.on(event, callback);
    });
  }
}

class Randomizer extends BaseControllable {
  constructor(args: ControllableArgs) {
    super(args);
    this.currentTrack = selectRandomFrom(this.tracks) as Controllable;
  }

  public play() {
    this.currentTrack = selectRandomFrom(this.tracks) as Controllable;
    this.currentTrack.play();
  }

  public stop() {
    this.currentTrack.stop();
  }
}

class Looper extends BaseControllable {
  private loopTracks: boolean = true;

  constructor(args: ControllableArgs) {
    super(args);
    super.on("end", () => {
      this.nextTrack()
    });
    this.currentTrack = selectRandomFrom(this.tracks) as Controllable;
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
      this.currentTrack = selectRandomFrom(this.tracks) as Controllable;
      this.currentTrack.play();
    }
  }
}

interface SilenceableArgs {
  silenced: boolean;
}

class Silenceable extends BaseControllable {
  private isSilent: boolean;
  private volumes: Record<number, number>;

  constructor(args: ControllableArgs & SilenceableArgs) {
    super(args);
    this.volumes = this.tracks.reduce((mappings, track, index) => {
      mappings[index] = track.volume();
      return mappings;
    }, {} as Record<number, number>);

    this.isSilent = args.silenced;
    this.applySilenced();
  }

  public get silenced(): boolean {
    return this.isSilent;
  }

  public set silenced(silenced: boolean) {
    this.isSilent = silenced;
    this.applySilenced();
  }

  private applySilenced() {
    if (this.isSilent) {
      this.tracks.forEach((track) => {
        track.volume(0);
      });
    } else {
      for(const [index, volume] of Object.entries(this.volumes)) {
        this.tracks[Number(index)]?.volume(volume);
      }
    }
  }
}