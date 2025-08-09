import { z } from 'zod';

export const createHallencardSchema = {
	value: z.number(),
};

export const createHallencardSchemaObject = z.object(createHallencardSchema);

export const useHallencardSchema = {
	code: z.string(),
	pin: z.string().length(6),
};

export const useHallencardForAnotherPersonSchema = {
	code: z.string(),
	userId: z.string(),
};

export enum HallencardStatus {
	CREATED = 'CREATED',
	PRINTED = 'PRINTED',
	USED = 'USED',
}
