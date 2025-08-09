import { z } from 'zod';

export const controlInterfaceSchema = {
  //id           :z.string(),
  title: z.string(),
  description: z.string(),
  preBooking: z.number(),
  postBooking: z.number(),
  connectByAnd: z.boolean().optional(),
  connectByOr: z.boolean().optional(),

  affectedCourts: z.string().array().optional(),
};

export const controlInterfaceSchemaObject = z.object(controlInterfaceSchema);
