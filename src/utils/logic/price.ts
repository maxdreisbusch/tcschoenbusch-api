import { addMinutes, differenceInMinutes, getHours, getZeroBasedWeekdayInteger, isBefore, subMinutes } from './date';
import { prisma } from 'db';

export const calculateReservationPrice = (start: Date, end: Date, prices: { from: number; to: number; value: number; taxes: number }[]) => {
	let total = 0;
	let taxRate = 0;
	let currentTimeFrame = start;
	const finalEnd = subMinutes(end, 2);
	while (isBefore(currentTimeFrame, finalEnd)) {
		const hours = parseInt(getHours(currentTimeFrame));
		let bestPrice: number | undefined = undefined;
		const fittingPrices = prices.filter((price) => price.from <= hours && price.to > hours);
		for (const fittingPrice of fittingPrices) {
			if (bestPrice === undefined || bestPrice > fittingPrice.value) bestPrice = fittingPrice.value;
			if (taxRate === 0 || taxRate > fittingPrice.taxes) taxRate = fittingPrice.taxes;
		}
		total += (bestPrice ?? 0) / 4;
		currentTimeFrame = addMinutes(currentTimeFrame, 15);
	}

	return { total, taxRate };
};

export const getCourtPrice = async (start: Date, end: Date, userRoles: number[], courtId: string) => {
	const startHours = parseInt(getHours(start));
	const endHours = parseInt(getHours(end));

	const prices = await prisma.price.findMany({
		select: { from: true, to: true, value: true, currency: true, taxes: true },
		where: {
			roles: { some: { OR: userRoles.map((i) => ({ id: i })) ?? [] } },
			[getWeekday(start)]: true,
			validFrom: { lte: start },
			validTo: { gte: end },
			areas: { some: { courts: { some: { id: courtId } } } },
			OR: [
				//Start and End with price time bzw. in between a price section
				{ from: { lte: startHours }, to: { gte: endHours } },
				//Start and end in different price sections
				{ from: { lte: startHours }, to: { gte: startHours } },
				{ from: { lte: endHours }, to: { gte: endHours } },
			],
		},
		orderBy: {
			value: 'asc',
		},
	});

	if (prices.length === 1) {
		const hours = differenceInMinutes(start, end) / 60;
		if (prices[0]?.value) {
			return { total: prices[0]?.value * hours, taxRate: prices[0]?.taxes };
		}
	} else if (prices.length > 0) {
		return calculateReservationPrice(start, end, prices);
	}
	return { total: 0, taxRate: 0 };
};

const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const getWeekday = (date: Date): string => weekDays[getZeroBasedWeekdayInteger(date)] ?? 'mon';
