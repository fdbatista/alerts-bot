import { format } from 'date-fns'

export class DateUtil {
    static formatCurrentDate() {
        const now: Date = new Date();
        return format(now, 'yyyy-mm-dd HH:mi:ss');
    }
}
