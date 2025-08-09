import type { ReservationStatus, ReservationType } from 'db/databaseTypes';

export interface ReservationRawData {
	title: string;
	start: Date;
	end: Date;
	courtId: string | null;
	status: ReservationStatus;
	type?: ReservationType;
	ownerId: string;
	light: boolean;
	radiator: boolean;
	fellows: { connect: { id: string }[] } | undefined;
	price: number;
	taxRate: number;
}

export enum AvailableRuleCheckPlugins {
	maxTimeBefore = 'maxTimeBefore',
	minTimeBefore = 'minTimeBefore',
	minDuration = 'minDuration',
	maxDuration = 'maxDuration',
	maxBookingsAtSameTime = 'maxBookingsAtSameTime',
}

export interface RuleCheckPlugins {
	[key: string]: (reservation: ReservationRawData, value: string) => Promise<boolean> | boolean;
}
