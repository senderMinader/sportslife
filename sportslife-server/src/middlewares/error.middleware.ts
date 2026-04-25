import { NextFunction, Request, Response } from 'express';
import { ZodError, z } from 'zod';

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: 'Validation failed',
      errors: z.treeifyError(error),
    });
    return;
  }

  if (error instanceof Error) {
    const knownMessages = new Set([
      'Invalid credentials',
      'Tournament not found',
      'Participant not found',
      'Match not found',
      'Only draft tournaments can be updated',
      'Only draft tournaments can be deleted',
      'Tournament has already started or is not editable',
      'Participants can only be added before tournament start',
      'Participants can only be updated before tournament start',
      'Participants can only be deleted before tournament start',
      'Only ready or in progress matches can be updated',
      'Only pending or ready matches can be cancelled',
      'Match participants are incomplete',
      'A winner is required, draw is not allowed',
    ]);

    res.status(knownMessages.has(error.message) ? 400 : 500).json({
      message: error.message,
    });
    return;
  }

  res.status(500).json({
    message: 'Internal server error',
  });
};
