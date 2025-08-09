import type { ReservationRawData } from './type';
import { isBefore, subMinutes } from '../logic/date';

//MaxTime Before means: I can book a court e.g. until 10minutes before the booking starts
export const checkMinTimeBefore = (reservation: ReservationRawData, value: string) => {
	const latestBookableTime = subMinutes(reservation.start, parseInt(value));
	return isBefore(new Date(), latestBookableTime);
};
