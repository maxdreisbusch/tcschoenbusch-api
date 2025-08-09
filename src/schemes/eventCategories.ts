import { z } from 'zod';

export const eventCategoriesSchema = {
  id: z.string().optional(),
  slug: z.string(),
  title: z.string(),
};

export const eventCategoriesSchemaObject = z.object(eventCategoriesSchema);
