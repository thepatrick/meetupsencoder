import { Request, Response } from 'express';
import { DatabasePoolConnectionType, DatabasePoolType } from 'slonik';

export const withDatabaseConnection:
  <T>(
    pool: DatabasePoolType,
    fn: (
      req: Request, res: Response, connection: DatabasePoolConnectionType,
    ) => Promise<T>) =>
    ((req: Request, res: Response) => Promise<T>)
  = (pool, fn) => async (req, res) => pool.connect(fn.bind(null, req, res));
