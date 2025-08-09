import { TeamCategory } from 'db/databaseTypes';
import { z } from 'zod';

export const teamSchema = {
	id: z.number().optional(),
	name: z.string(),
	shortName: z.string(),
	category: z.nativeEnum(TeamCategory),
	orderNumber: z.number(),
};

export const teamSchemaObject = z.object(teamSchema);
export type TeamSchemaType = z.infer<typeof teamSchemaObject>;
