import { z } from 'zod';

export const eventSchema = {
  id: z.string().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  categoryId: z.string(),
  image: z.string().nullable().optional(),
  start: z.date(),
  end: z.date().nullable().optional(),
  canceled: z.boolean().optional(),
  revised: z.boolean().optional(),
  link: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
};

export const eventSchemaObject = z.object(eventSchema);
