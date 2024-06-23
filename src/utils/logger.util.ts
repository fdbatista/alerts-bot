import { DateUtil } from './date.util'
import { StringUtil } from './string.util';

export class LoggerUtil {
    static log(message: string, data?: any): void {
        const logMessage = this.formatMessage(message);
        console.log(logMessage, data ?? StringUtil.EMPTY_STRING);
    }

    static debug(message: string, data?: object): void {
        const logMessage = this.formatMessage(message);
        console.debug(logMessage, data ?? StringUtil.EMPTY_STRING);
    }

    static error(message: string, data?: object): void {
        const logMessage = this.formatMessage(message);
        console.error(logMessage, data ?? StringUtil.EMPTY_STRING);
    }

    private static formatMessage(message: string): string {
        const formatedCurrentDate = DateUtil.formatCurrentDate();
        return `${formatedCurrentDate}: ${message}`;
    }
}
