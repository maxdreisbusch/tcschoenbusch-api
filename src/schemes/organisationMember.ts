import { z } from 'zod';

export const organisationMemberSchema = {
  id: z.string().optional(),
  fullName: z.string(),
  function: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),

  orderID: z.number().optional().nullable(),
  organisationId: z.string(),
  parentMemberId: z.string().optional().nullable(),
  childMembers: z.string().array().optional().nullable(),
};

export const organisationMemberSchemaObject = z.object(organisationMemberSchema);
