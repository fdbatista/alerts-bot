import { formatInTimeZone } from 'date-fns-tz';

const DEFAULT_TZ = 'Europe/Berlin';
const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';
const DATE_UNTIL_MINUTES_FORMAT = 'yyyy-MM-dd HH:mm';

export class DateUtil {
    static formatCurrentDate(): string {
        const now: Date = new Date();

        return this.formatDate(now);
    }

    static formatDate(date: Date): string {
        const timezone: string = process.env.TZ ?? DEFAULT_TZ;

        return formatInTimeZone(date, timezone, DATE_FORMAT);
    }

    static formatDateUntilMinutes(date: Date): string {
        const timezone: string = process.env.TZ ?? DEFAULT_TZ;

        return formatInTimeZone(date, timezone, DATE_UNTIL_MINUTES_FORMAT);
    }
}
