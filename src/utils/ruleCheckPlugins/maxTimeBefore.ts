import type { ReservationRawData } from './type';
import { isBefore, subMinutes } from '../logic/date';

//MaxTime Before means: I can book a court e.g. 3h before the booking starts
export const checkMaxTimeBefore = (reservation: ReservationRawData, value: string) => {
	const earliestBookableTime = subMinutes(reservation.start, parseInt(value));
	return isBefore(earliestBookableTime, new Date());
};
