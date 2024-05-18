import { formatInTimeZone } from 'date-fns-tz';

const DEFAULT_TZ = 'Europe/Berlin';
const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

export class DateUtil {
    static formatCurrentDate() {
        const now: Date = new Date();
        const timezone: string = process.env.TZ ?? DEFAULT_TZ;

        return formatInTimeZone(now, timezone, DATE_FORMAT);
    }
}
