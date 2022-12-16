import { fromMaybe, Maybe } from "./utils";

export interface Logger {
    debug(...data: any[]): void;
    info(...data: any[]): void;
    log(...data: any[]): void;
    warn(...data: any[]): void;
}

export const DefaultLogger: Logger = console;

export interface Formatter {
    format(prefix: string, ...data: any[]): string;
}

export const DefaultFormatter: Formatter = {
    format(prefix: string, ...data: any[]): string {
        if (prefix) {
            return `${prefix} - ${data}`;
        }
        return `${data}`;
    },
};

export type LoggerOperations = keyof Logger;

interface DeploymentLoggerArgs {
    logger?: Logger;
    formatter?: Formatter;
    prefix?: string;
}


export class DeploymentLogger implements Logger {
    private logger: Logger;
    private formatter: Formatter;
    private maybePrefix: Maybe<string>;

    constructor(args?: DeploymentLoggerArgs) {
        const {
            logger,
            formatter,
            prefix
        } = {...args};

        this.logger = fromMaybe({
            maybe: logger,
            fallback: DefaultLogger
        });

        this.formatter = fromMaybe({
            maybe: formatter,
            fallback: DefaultFormatter
        });

        this.maybePrefix = prefix;
    }
    
    public debug(...data: any[]): void {
        this.write('debug', ...data);
    }
    public info(...data: any[]): void {
        this.write('info', ...data);
    }
    public log(...data: any[]): void {
        this.write('log', ...data);
    }
    public warn(...data: any[]): void {
        this.write('warn', ...data);
    }

    private write(action: LoggerOperations, ...data: any[]): void {
        const output = this.formatter.format(this.prefix, ...data);
        this.logger[action](output);
    }

    private get prefix() {
        return fromMaybe<string>({
            maybe: this.maybePrefix,
            fallback: `${new Date().toISOString()} deploy`
        });
    }
}
