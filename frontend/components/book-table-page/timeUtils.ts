// timeUtils.ts
export const isTimeWithinRange = (time: string, start: string, end: string) => {
    const [timeHours, timeMinutes] = time.split(':').map(Number);
    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);

    const selectedTimeInMinutes = timeHours * 60 + timeMinutes;
    const startTimeInMinutes = startHours * 60 + startMinutes;
    const endTimeInMinutes = endHours * 60 + endMinutes;

    return selectedTimeInMinutes >= startTimeInMinutes && selectedTimeInMinutes <= endTimeInMinutes;
};
