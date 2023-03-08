import moment from 'moment';

export function __getWorkingDay(date: string): string {
    if (moment(date).day() == 0 || moment(date).day() == 6) {
        let dayCount: number = 1;
        while (moment(date).day() == 0 || moment(date).day() == 6) {
            date = moment(date).subtract(dayCount, 'day').format('YYYY-MM-DD');
        }
        return date
    } else {
        return date
    }
}