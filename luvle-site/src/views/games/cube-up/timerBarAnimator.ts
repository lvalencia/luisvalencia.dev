import type { PerspectiveCamera } from "three";
import type { SimpleVector } from "../shared/simpleVector";
import type{ TimerBar } from "./timerBar";

interface TimerBarAnimatorArgs {
  timerBar: TimerBar;
  camera: PerspectiveCamera;
}

const MILLIS_IN_SECONDS = 1000;

enum TimerState {
  PLENTY_OF_TIME = 0x00ff00,
  MID_TIME = 0xffa500,
  RUNNING_OUT_OF_TIME = 0xff0000,
  DANGER = 0x8b0000,
}

export class TimerBarAnimator {
  private readonly camera: PerspectiveCamera;
  private readonly timerBar: TimerBar;
  private startedAt: number = 0;
  private timeAllotmentUsedBeforePauseInSeconds: number = 0;
  private timeAllotedInSeconds: number = Number.POSITIVE_INFINITY;
  private shortCircuit: boolean = false;
  private initialPosition: SimpleVector;

  constructor(args: TimerBarAnimatorArgs) {
    const {
      timerBar,
      camera
    } = args;

    this.timerBar = timerBar;
    this.camera = camera;

    const {
      x, y, z
    } = this.timerBar.position;

    this.initialPosition = {
      x, y, z
    }
  }

  public countdown(time: DOMHighResTimeStamp): boolean {
    if (this.timeAllotedInSeconds === Number.POSITIVE_INFINITY || this.shortCircuit) return false;

    const timeLeft = this.timeLeft(time);
    const shouldAnimate = timeLeft > 0;

    const breathingAmplitude = 1 / 2200; 
    const breathingFrequency = 1 / 200; 

    if (shouldAnimate) {
      const percentageTimeLeft = timeLeft / this.timeAllotedInSeconds;
      this.timerBar.scaleX(percentageTimeLeft);
      this.timerBar.barColor = this.getTimerStateForProgress(percentageTimeLeft);
      
      this.timerBar.position.z += (breathingAmplitude * Math.sin(breathingFrequency * time));
    }

    const outOfTime = !shouldAnimate;
    return outOfTime;
  }

  public startCountDown(totalTimeInSeconds: number, timeStarted: number): void {
    this.startedAt = timeStarted;
    this.timeAllotedInSeconds = totalTimeInSeconds;
  }

  public pause(pausedAt: number = performance.now()) {
    this.shortCircuit = true;
    this.timeAllotmentUsedBeforePauseInSeconds = this.timeAllotedInSeconds - this.timeLeft(pausedAt);
  }

  public resume(resumedAt: number = performance.now()) {
    this.shortCircuit = false;
    this.startedAt = resumedAt - this.timeAllotmentUsedBeforePauseInSeconds * MILLIS_IN_SECONDS;
  }

  public timeLeftInSeconds(fromNow: number = performance.now()) {
    return this.timeLeft(fromNow);
  }

  public reset(): void {
    this.shortCircuit = false;
    this.timerBar.scaleX(1);
    this.timerBar.barColor = TimerState.PLENTY_OF_TIME;
    this.timerBar.position = this.initialPosition;
    this.timeAllotedInSeconds = Number.POSITIVE_INFINITY;
  }

  private getTimerStateForProgress(progress: number) {
    if (progress > 0.75) return TimerState.PLENTY_OF_TIME;
    if (progress > 0.5) return TimerState.MID_TIME;
    if (progress > 0.15) return TimerState.RUNNING_OUT_OF_TIME;
    return TimerState.DANGER;
  }

  private timeLeft(currentTime: number): number {
    const startTime = this.startedAt;
    const elapsedTimeInSeconds = (currentTime - startTime) / MILLIS_IN_SECONDS; 
    const timeLeft = this.timeAllotedInSeconds - elapsedTimeInSeconds;
    return timeLeft;
  }

}