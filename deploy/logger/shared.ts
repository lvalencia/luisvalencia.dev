export interface Logger {
  debug(...data: any[]): void;
  info(...data: any[]): void;
  log(...data: any[]): void;
  warn(...data: any[]): void;
  error(...error: any[]): void;
}

export const DefaultLogger: Logger = console;
