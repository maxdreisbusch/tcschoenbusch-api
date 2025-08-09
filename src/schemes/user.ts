import { z } from 'zod';

export const userSchema = {
  id: z.string().optional(),
  name: z.string().min(6),
  email: z.string().optional().nullable(),
  password: z.string().optional(),
  image: z.string().optional().nullable(),
  phoneNumber: z.string().min(5),
  address: z.string().min(2),
  cityCode: z.string().min(5),
  cityName: z.string().min(2),
  countryCode: z.string().optional().nullable(),
  roles: z.string().array().optional(),
  publicName: z.boolean().optional(),
};

export const userSchemaObject = z.object(userSchema);
