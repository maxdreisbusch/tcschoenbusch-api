import type { ReservationRawData } from './type';
import { differenceInMinutes } from '../logic/date';

export const checkMinDuration = (reservation: ReservationRawData, value: string) => {
	const val = parseInt(value);
	const duration = differenceInMinutes(reservation.end, reservation.start);

	return val <= duration;
};
