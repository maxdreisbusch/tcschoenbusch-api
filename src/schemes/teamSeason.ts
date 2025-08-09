import { z } from 'zod';

export const teamSeasonSchema = {
  teamId: z.number(),
  seasonId: z.number(),
  teamLeaderId: z.string().nullable().optional(),
  nuGroupId: z.string(),
  nuTeamId: z.string(),
  leagueName: z.string(),
};

export const teamSeasonSchemaObject = z.object(teamSeasonSchema);
export type TeamSeasonSchemaType = z.infer<typeof teamSeasonSchemaObject>;
