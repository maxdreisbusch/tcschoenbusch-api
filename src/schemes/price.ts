import { z } from 'zod';

export const priceSchema = {
  validFrom: z.date().optional(),
  validTo: z.date().optional(),
  isDefault: z.boolean().optional(),
  mon: z.boolean().optional(),
  tue: z.boolean().optional(),
  wed: z.boolean().optional(),
  thu: z.boolean().optional(),
  fri: z.boolean().optional(),
  sat: z.boolean().optional(),
  sun: z.boolean().optional(),
  from: z.string(),
  to: z.string(),
  value: z.number(),
  taxes: z.number(),
  currency: z.string(),
  roles: z.string().array(),
  areas: z.string().array(),
};
