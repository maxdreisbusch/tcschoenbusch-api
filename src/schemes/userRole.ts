import { z } from 'zod';

export const userRoleSchema = {
  title: z.string(),
  description: z.string().optional().nullable(),
  priority: z.number(),
  isDefault: z.boolean(),
};

export const userRoleSchemaObject = z.object(userRoleSchema);
