import { z } from 'zod';

export const createParticipantSchema = z.object({
  tournamentId: z.string().min(1),
  name: z.string().min(2).max(120),
  seed: z.number().int().positive().nullable().optional(),
});

export const updateParticipantSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  seed: z.number().int().positive().nullable().optional(),
});

export const participantIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const participantListQuerySchema = z.object({
  tournamentId: z.string().min(1),
});

export type CreateParticipantInput = z.infer<typeof createParticipantSchema>;
export type UpdateParticipantInput = z.infer<typeof updateParticipantSchema>;
