import { z } from 'zod';

export const seasonSchema = {
  id: z.number().optional(),
  name: z.string(),
  shortName: z.string(),
  starting: z.date(),
  ending: z.date(),
};

export const seasonSchemaObject = z.object(seasonSchema);
export type SeasonSchemaType = z.infer<typeof seasonSchemaObject>;
