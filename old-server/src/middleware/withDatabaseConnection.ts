import { DatabasePoolType, DatabasePoolConnectionType } from 'slonik';
import { Request, Response } from 'express';

export const withDatabaseConnection:
  <T>(
    pool: DatabasePoolType,
    fn: (
      req: Request, res: Response, connection: DatabasePoolConnectionType,
    ) => Promise<T>) =>
    ((req: Request, res: Response) => Promise<T>)
  = (pool, fn) => async (req, res) => pool.connect(fn.bind(null, req, res));
