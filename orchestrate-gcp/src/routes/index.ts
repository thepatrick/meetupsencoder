import { Storage } from '@google-cloud/storage';
import { Application, NextFunction, Request, Response } from 'express';
import { getStatusText, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { DatabasePoolType, sql } from 'slonik';
import { getJob, insertJobWithSubmission, updateJobStatus } from '../encoder/job/JobService';
import { isValidJobStatus } from '../encoder/job/JobStatus';
import { isValidJobSubmission } from '../encoder/job/JobSubmission';
import { isHttpResponseError } from '../httpErrors/HttpResponseError';
import { NotFoundError } from '../httpErrors/NotFoundError';
import { UnprocessableEntityError } from '../httpErrors/UnprocessableEntityError';
import { asyncResponse } from '../middleware/asyncResponse';
import { hasJWTToken } from '../middleware/hasJWTToken';
import { hasSecret } from '../middleware/hasSecret';
import { withDatabaseConnection } from '../middleware/withDatabaseConnection';
import { Logger } from 'pino';
import { request } from 'http';
import shortid = require('shortid');

type RegisterRoutes = (
  logger: Logger,
  app: Application,
  pool: DatabasePoolType,
  storage: Storage,
  secret: string,
  bucket: string,
) => void;

const isNonEmptyString = (possible: unknown): possible is string => {
  return typeof possible === 'string' && possible.length > 0;
};

export const registerRoutes: RegisterRoutes = (
  logger,
  app,
  pool,
  storage,
  secret,
  bucket,
) => {
  app.get('/api/v1/job', hasSecret(secret), asyncResponse(
    withDatabaseConnection(
      pool, async (req, res, connection) => {
        const groups = await connection.any(
          sql`
            SELECT
              "jobId",
              "bucket",
              "fileName",
              "status",
              "createdAt",
              "updatedAt",
              "cloudInstanceName"
            FROM job
            ORDER BY "createdAt" DESC
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

        console.log('jobSubmission', jobSubmission);

        const id = await insertJobWithSubmission(
          storage,
          bucket,
          connection,
          jobSubmission,
        );

        return { id };
      },
    ),
  ));

  app.get('/api/v1/job/:jobId/config', hasJWTToken(secret, 'jobId'), asyncResponse(
    withDatabaseConnection(
      pool,
      async (req, res, connection) => {
        const jobId = req.params.jobId;
        if (!isNonEmptyString(jobId)) {
          throw new NotFoundError();
        }

        const job = await getJob(connection, jobId);

        return job.cloudInitData;
      },
    ),
  ));

  app.post('/api/v1/job/:jobId/status', hasJWTToken(secret, 'jobId'), asyncResponse(
    withDatabaseConnection(
      pool,
      async (req, res, connection) => {
        const jobId = req.params.jobId;
        if (!isNonEmptyString(jobId)) {
          throw new NotFoundError();
        }

        const status = req.body.status;
        if (!isValidJobStatus(status)) {
          throw new UnprocessableEntityError(`Unexpected status ${status}`);
        }

        logger.info(`Updating ${jobId} to ${status}`);
        await updateJobStatus(
          logger,
          connection,
          jobId,
          status,
        );

        return {
          jobId,
          status,
          ok: true,
        };
      },
    ),
  ));

  app.post('/api/v1/job/:jobId/log', hasJWTToken(secret, 'jobId'), asyncResponse(
    withDatabaseConnection(
      pool,
      async (req, res, connection) => {
        const jobId = req.params.jobId;
        if (!isNonEmptyString(jobId)) {
          throw new NotFoundError();
        }

        const {
          level,
          message,
          info,
        } = req.body;

        logger.info(
          `${jobId} [${level}]: ${message}`,
          {
            level,
            ...info,
          },
        );

        return { ok: true };
      },
    ),
  ));

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(err);
    }
    let statusCode = INTERNAL_SERVER_ERROR;
    let message = getStatusText(statusCode);
    if (isHttpResponseError(err)) {
      statusCode = err.statusCode;
      message = err.message;
    }
    res.status(statusCode).send({ statusCode, error: message });

    logger.error(`Error processing request ${message}`, {
      req,
      err,
      statusCode,
    });

  });
};
