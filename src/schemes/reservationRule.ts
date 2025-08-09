import { ReservationRuleCheckOn } from 'db/databaseTypes';
import { z } from 'zod';

export const reservationRuleSchema = {
	name: z.string(),
	errorDescription: z.string().optional(),
	validFor: z.string().array().optional(),
	affectedAreas: z.string().array().optional(),
	affectedCourts: z.string().array().optional(),
	checkOn: z.nativeEnum(ReservationRuleCheckOn),
	ruleCheckPluginName: z.string().optional(),
	value: z.string(),
};
