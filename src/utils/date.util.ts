import { formatInTimeZone } from 'date-fns-tz'
const DEFAULT_TZ = 'Europe/Berlin'

export class DateUtil {
    static formatCurrentDate() {
        const now: Date = new Date();
        const timezone = process.env.TZ ?? DEFAULT_TZ

        return formatInTimeZone(now, timezone, 'yyyy-MM-dd HH:mm:ss');
    }
}
