import { z } from 'zod';

export const courtSchema = {
  name: z.string(),
  shortName: z.string().nullable(),
  description: z.string().nullable().optional(),
  active: z.boolean().optional(),
  activeFrom: z.date().nullable().optional(),
  activeTo: z.date().nullable().optional(),
  areaId: z.number(),
  order: z.number().nullable().optional(),
};

export const courtSchemaObject = z.object(courtSchema);
