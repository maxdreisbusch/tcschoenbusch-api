import { DateTime, Interval, Settings } from 'luxon';

Settings.defaultLocale = 'de';
Settings.defaultZone = 'Europe/Berlin';

export const addDays = (date: Date, amount: number) => DateTime.fromJSDate(date).plus({ day: amount }).toJSDate();
export const subDays = (date: Date, amount: number) => DateTime.fromJSDate(date).minus({ day: amount }).toJSDate();

export const addHours = (date: Date, amount: number) => DateTime.fromJSDate(date).plus({ hour: amount }).toJSDate();
export const subHours = (date: Date, amount: number) => DateTime.fromJSDate(date).minus({ hour: amount }).toJSDate();

export const addMinutes = (date: Date, amount: number) => DateTime.fromJSDate(date).plus({ minute: amount }).toJSDate();
export const subMinutes = (date: Date, amount: number) => DateTime.fromJSDate(date).minus({ minute: amount }).toJSDate();

export const differenceInMinutes = (end: Date, start: Date) =>
	DateTime.fromJSDate(start).diff(DateTime.fromJSDate(end), ['minutes', 'seconds', 'milliseconds']).minutes;

export const format = (date: Date, format: string) => DateTime.fromJSDate(date).toFormat(format);

export const formatDate = (date: Date) => format(date, 'dd.MM.yyyy');

export const formatTime = (date: Date) => format(date, 'H:mm');

export const getHours = (date: Date) => format(date, 'Hmm');

export const isActivePeriod = (date: Date, data?: { activeFrom?: Date | null; activeTo?: Date | null } | null) => {
	if (!data || !data.activeFrom || !data.activeTo) return false;

	if (isBefore(date, data.activeFrom) || isAfter(date, data.activeTo)) return true;

	return false;
};

export const getIntervalFromJsDate = (firstDate: Date, secondDate: Date) => {
	const fd = DateTime.fromJSDate(firstDate);
	const sd = DateTime.fromJSDate(secondDate);

	return Interval.fromDateTimes(fd, sd);
};

export const isBefore = (firstDate: Date, secondDate: Date) => DateTime.fromJSDate(firstDate) < DateTime.fromJSDate(secondDate);

export const isAfter = (firstDate: Date, secondDate: Date) => DateTime.fromJSDate(firstDate) > DateTime.fromJSDate(secondDate);

export const compareAsc = (firstDate: Date, secondDate: Date) => {
	const result = DateTime.fromJSDate(firstDate).toSeconds() - DateTime.fromJSDate(secondDate).toSeconds();
	return result < 0 ? -1 : result > 0 ? 1 : 0;
};

export const startOfDay = (date: Date) => DateTime.fromJSDate(date).startOf('day').toJSDate();
export const endOfDay = (date: Date) => DateTime.fromJSDate(date).endOf('day').toJSDate();

const zeroBasedWeekDayIntegers = [1, 2, 3, 4, 5, 6, 0];
export const getZeroBasedWeekdayInteger = (date: Date): number => zeroBasedWeekDayIntegers[DateTime.fromJSDate(date).get('weekday') - 1] ?? 1;
