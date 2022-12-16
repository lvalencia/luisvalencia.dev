export interface Formatter {
    format(...data: any[]): string;
}

export const NoOpFormatter: Formatter = {
    format(...data: any[]): string {
        return `${data}`;
    }
}
