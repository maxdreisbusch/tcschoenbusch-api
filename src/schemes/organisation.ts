import { z } from 'zod';

export const organisationSchema = {
  id: z.string().optional(),
  slug: z.string(),
  title: z.string(),
};

export const organisationSchemaObject = z.object(organisationSchema);
