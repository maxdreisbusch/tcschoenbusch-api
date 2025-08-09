import { z } from 'zod';

export const benefitSchema = {
  title: z.string(),
  description: z.string().nullable(),
  image: z.string().optional().nullable(),
  cover: z.boolean().optional(),
  link: z.string().url().optional().nullable(),

  activeFrom: z.date().optional().nullable(),
  activeTo: z.date().optional().nullable(),
};

export const benefitSchemaObject = z.object(benefitSchema);
