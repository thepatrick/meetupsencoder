import { Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';

export const asyncResponse: (
  fn: (req: Request, res: Response) => Promise<unknown>) => ((req: Request, res: Response) => void
  ) =
  fn => async (req, res) => {
    try {
      res.send(await fn(req, res));
    } catch (err) {
      res.send({ error: err.message });
    }
  };

export class AsyncResponseError extends Error {
  constructor(message: string, public code: number = INTERNAL_SERVER_ERROR) {
    super(message);
  }
}
