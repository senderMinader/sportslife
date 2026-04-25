import { z } from 'zod';

export const matchIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const matchListQuerySchema = z.object({
  tournamentId: z.string().min(1),
});

export const updateMatchResultSchema = z.object({
  score1: z.number().min(0),
  score2: z.number().min(0),
});

export type UpdateMatchResultInput = z.infer<typeof updateMatchResultSchema>;
