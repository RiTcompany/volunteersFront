export const convertToISO = (dateStr: string | undefined): string => {
    if (dateStr === undefined) return '';
    dateStr = dateStr.replace("  ", " ");

    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('.');
    const [hours, minutes] = timePart.split(':');

    const dayNumber = Number(day);
    const monthNumber = Number(month) - 1;
    const yearNumber = Number(year);
    const hoursNumber = Number(hours);
    const minutesNumber = Number(minutes);

    const localDate = new Date(yearNumber, monthNumber, dayNumber, hoursNumber, minutesNumber);

    const mskOffset = 0;
    const utcDate = new Date(localDate.getTime() - (mskOffset * 60 * 60 * 1000));
    return utcDate.toISOString();
};

export function formatDateTime(inputDate: string | undefined) {
    if (inputDate == undefined) return
    const date = new Date(inputDate);
    const formattedDate = date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });
    return `${formattedDate} ${formattedTime}`;
}
