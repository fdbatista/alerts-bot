import { DateUtil } from './date.util'

export class LoggerUtil {
    static log(message: string, data?: object): void {
        const logMessage = this.formatMessage(message);
        console.log(logMessage, data);
    }

    static debug(message: string, data?: object): void {
        const logMessage = this.formatMessage(message);
        console.debug(logMessage, data);
    }

    static error(message: string, data?: object): void {
        const logMessage = this.formatMessage(message);
        console.error(logMessage, data);
    }

    private static formatMessage(message: string): string {
        const formatedCurrentDate = DateUtil.formatCurrentDate();
        return `${formatedCurrentDate}: ${message}`;
    }
}
