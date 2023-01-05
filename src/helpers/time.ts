import { isSomething } from "./maybe";

interface TimeExpressible {
  inMilliseconds(): number;
  inSeconds(): number;
}

interface Seconds {
  seconds: number;
  milliSeconds?: undefined;
}
interface MilliSeconds {
  milliSeconds: number;
  seconds?: undefined;
}

type TimeArgs = Seconds | MilliSeconds;

const TimeUnits = {
  Millis: 1000,
};

export class Time implements TimeExpressible {
  private readonly internalTime!: number;

  constructor(args: TimeArgs) {
    const { seconds, milliSeconds } = args;
    if (isSomething(seconds)) {
      this.internalTime = seconds * TimeUnits.Millis;
    }
    if (isSomething(milliSeconds)) {
      this.internalTime = milliSeconds;
    }
  }

  public inMilliseconds(): number {
    return this.internalTime;
  }

  public inSeconds(): number {
    return this.internalTime / TimeUnits.Millis;
  }
}
