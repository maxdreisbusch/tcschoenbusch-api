import { DateTime } from 'luxon';
import { addMinutes, differenceInMinutes, format, isAfter } from './date';

export const getAvailableTimeSlots = (startTime: Date, maxEndTime: Date, nextBookingStart?: Date) => {
	let theTime = DateTime.fromJSDate(maxEndTime)
		.set({
			year: startTime.getFullYear(),
			month: startTime.getMonth() + 1,
			day: startTime.getDate(),
		})
		.toJSDate();
	if (nextBookingStart && isAfter(theTime, nextBookingStart)) {
		theTime = nextBookingStart;
	}

	const timeslots: { label: string; value: string }[] = [];
	let currentDifference = 0.5;
	for (let addTime = addMinutes(startTime, 30); differenceInMinutes(addTime, theTime) >= 0; addTime = addMinutes(addTime, 30)) {
		timeslots.push({
			label: `${format(addTime, 'HH:mm')} (${currentDifference.toString().replace('.', ',')} Stunden)`,
			value: currentDifference.toString(),
		});
		currentDifference = currentDifference + 0.5;
	}
	return timeslots;
};
