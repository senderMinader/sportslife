import { z } from 'zod';

import { TournamentType } from '../../common/enums/tournament-type.enum';

export const createTournamentSchema = z.object({
  name: z.string().min(3).max(120),
  description: z.string().max(1000).nullable().optional(),
  type: z.enum(TournamentType).default(TournamentType.SINGLE_ELIMINATION),
});

export const updateTournamentSchema = z.object({
  name: z.string().min(3).max(120).optional(),
  description: z.string().max(1000).nullable().optional(),
});

export const tournamentIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const tournamentListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;
export type UpdateTournamentInput = z.infer<typeof updateTournamentSchema>;
export type TournamentListQuery = z.infer<typeof tournamentListQuerySchema>;
