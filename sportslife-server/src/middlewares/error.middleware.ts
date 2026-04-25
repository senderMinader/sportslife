import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { env } from '../config/env';

const KNOWN_BAD_REQUEST_MESSAGES = new Set([
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
  'A tournament requires at least 4 participants to start',
  'Tournament matches have already been generated',
  'Next match not found',
]);

export const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error('API error:', {
    method: req.method,
    path: req.originalUrl,
    body: req.body,
    params: req.params,
    query: req.query,
    error,
  });

  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({
      message: 'Malformed JSON body',
      ...(env.NODE_ENV === 'development'
        ? {
            details: error.message,
            stack: error.stack,
          }
        : {}),
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      message: 'Validation failed',
      errors: error.flatten(),
      ...(env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
    });
    return;
  }

  if (error instanceof Error) {
    const statusCode = KNOWN_BAD_REQUEST_MESSAGES.has(error.message) ? 400 : 500;

    res.status(statusCode).json({
      message: error.message,
      ...(env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
    });
    return;
  }

  res.status(500).json({
    message: 'Internal server error',
    ...(env.NODE_ENV === 'development' ? { error } : {}),
  });
};
