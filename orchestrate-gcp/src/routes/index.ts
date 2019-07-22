import Compute from '@google-cloud/compute';
import { Storage } from '@google-cloud/storage';
import { Application, NextFunction, Request, Response } from 'express';
import { getStatusText, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { DatabasePoolType, sql } from 'slonik';
import { isHttpResponseError } from '../httpErrors/HttpResponseError';
import { asyncResponse } from '../middleware/asyncResponse';
import { hasSecret } from '../middleware/hasSecret';
import { withDatabaseConnection } from '../middleware/withDatabaseConnection';
import { isValidJobSubmission } from '../encoder/job/Job';
import { UnprocessableEntityError } from '../httpErrors/UnprocessableEntityError';
import { insertJobWithSubmission } from '../encoder/job/JobService';

type RegisterRoutes = (
  app: Application,
  pool: DatabasePoolType,
  compute: Compute,
  storage: Storage,
  secret: string,
  bucket: string,
  selfUrl: string,
) => void;

const isNonEmptyString = (possible: unknown): possible is string => {
  return typeof possible === 'string' && possible.length > 0;
};

export const registerRoutes: RegisterRoutes = (
  app,
  pool,
  compute,
  storage,
  secret,
  bucket,
  selfUrl,
) => {
  app.get('/api/v1/job', hasSecret(secret), asyncResponse(
    withDatabaseConnection(
      pool, async (req, res, connection) => {
        const groups = await connection.any(
          sql`
            SELECT
              job_id,
              bucket,
              file_name,
              status,
              created_at,
              updated_at,
              cloud_instance_id
            FROM job
            ORDER BY created_at DESC
          `,
        );

        return groups;
      }),
  ));

  app.post('/api/v1/job', hasSecret(secret), asyncResponse(
    withDatabaseConnection(
      pool,
      async (req, res, connection) => {
        const jobSubmission = req.body;

        if (!isValidJobSubmission(jobSubmission)) {
          // TODO: Actuall call out that it's a validation proble.
          throw new UnprocessableEntityError();
        }

        const id = await insertJobWithSubmission(
          compute,
          storage,
          selfUrl,
          bucket,
          connection,
          jobSubmission,
        );

        return { id };
      },
    ),
  ));

  app.get('/api/v1/job/:jobId/config', asyncResponse(
    withDatabaseConnection(
      pool,
      async (req, res, connection) => {
        const jobId = req.params.jobId;
        if (!isNonEmptyString(jobId)) {
          throw new Error('Job not found');
        }
        const job = await connection.one(
          sql`SELECT cloud_init_data FROM job WHERE job_id = ${jobId}`,
        );

        return job.cloud_init_data;
      },
    ),
  ));

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(err);
    }

    console.error(err.stack);

    let statusCode = INTERNAL_SERVER_ERROR;
    let message = getStatusText(statusCode);
    if (isHttpResponseError(err)) {
      statusCode = err.statusCode;
      message = err.message;
    }
    res.status(statusCode).send({ statusCode, error: message });
  });
};
