import { prisma } from 'db';
import type { ReservationRawData } from './type';
import { ReservationStatus } from 'db/databaseTypes';
import { addHours, subHours } from '../logic/date';

export const checkMaxBookingsAtSameTime = async (reservation: ReservationRawData, values: string) => {
	const [hoursAround, maxBookings] = values.split(';');

	if (!hoursAround || !maxBookings) throw new Error('Wrong configuration, need to configure hoursAround;maxBookings');

	const startBefore = subHours(reservation.start, parseInt(hoursAround));
	const endAfter = addHours(reservation.end, parseInt(hoursAround));

	const reservations = await prisma.reservation.count({
		where: {
			start: { gte: startBefore },
			end: { lte: endAfter },
			OR: [{ ownerId: reservation.ownerId }, { fellows: { some: { id: reservation.ownerId } } }],

			status: ReservationStatus.APPROVED,
		},
	});

	return reservations < parseInt(maxBookings);
};
