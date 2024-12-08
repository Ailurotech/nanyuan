import { DateTime } from 'luxon/src/datetime';

export const isTimeWithinRange = (time: string, start: string, end: string): boolean => {
    const timeToCheck = DateTime.fromFormat(time, 'HH:mm');
    const startTime = DateTime.fromFormat(start, 'HH:mm');
    const endTime = DateTime.fromFormat(end, 'HH:mm');

    return timeToCheck >= startTime && timeToCheck <= endTime;
};

export const getDayOfWeek = (date: string): number => {
    const selectedDate = DateTime.fromISO(date);
    return selectedDate.weekday; 
};

export const isValidTime = (
    date: string,
    time: string,
    weekdayTimeRange: { start: string; end: string },
    weekendTimeRange: { start: string; end: string }
): boolean => {
    const dayOfWeek = getDayOfWeek(date);
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

    if (isWeekday) {
        return isTimeWithinRange(time, weekdayTimeRange.start, weekdayTimeRange.end);
    }
    return (
        isTimeWithinRange(time, weekdayTimeRange.start, weekdayTimeRange.end) ||
        isTimeWithinRange(time, weekendTimeRange.start, weekendTimeRange.end)
    );
};
