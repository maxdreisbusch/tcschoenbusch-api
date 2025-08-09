import { ReservationType } from 'db/databaseTypes';
import { z } from 'zod';

export const createReservationSchema = {
	title: z.string().optional(),
	start: z.date(),
	duration: z.string(),
	courtId: z.string(),
	type: z.nativeEnum(ReservationType).optional(),
	ownerId: z.string().optional(),
	fellows: z.object({ id: z.string(), name: z.string() }).array().optional(),
	//admin special things
	courts: z.string().array().optional(),
	repeatInterval: z.number().optional(),
	repeatUntil: z.date().optional(),
	repeatApproved: z.boolean().optional(),
};

export const createReservationSchemaObject = z.object(createReservationSchema);
export type CreateReservationSchemaType = z.infer<typeof createReservationSchemaObject>;

export const getPriceSchema = {
	start: z.date(),
	end: z.date(),
	courtId: z.string(),
};

export const updateReservationSchema = {
	id: z.string(),
	title: z.string().optional(),
	start: z.date().optional(),
	end: z.date().optional(),
	courtId: z.string().optional(),
	type: z.nativeEnum(ReservationType).optional(),
	ownerId: z.string().optional(),
	fellows: z.string().array().optional(),
	light: z.boolean().optional(),
	radiator: z.boolean().optional(),
};
