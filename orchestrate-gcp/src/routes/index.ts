import { Storage } from '@google-cloud/storage';
import { Application, NextFunction, Request, Response } from 'express';
import { getStatusText, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import nanoid from 'nanoid';
import shortid from 'shortid';
import { DatabasePoolType, sql } from 'slonik';
import { commandFromJob } from '../commandFromJob';
import { isHttpResponseError } from '../httpErrors/HttpResponseError';
import { asyncResponse } from '../middleware/asyncResponse';
import { hasSecret } from '../middleware/hasSecret';
import { withDatabaseConnection } from '../middleware/withDatabaseConnection';

type RegisterRoutes = (
  app: Application,
  pool: DatabasePoolType,
  storage: Storage,
  secret: string,
) => void;

const isNonEmptyString = (possible: unknown): possible is string => {
  return typeof possible === 'string' && possible.length > 0;
};

// TODO: REMOVE SECRET
export const registerRoutes: RegisterRoutes = (app, pool, storage, secret) => {
  app.get('/api/v1/job', hasSecret(secret), asyncResponse(
    withDatabaseConnection(
      pool, async (req, res, connection) => {
        const groups = await connection.any(
          sql`
            SELECT
              job_id,
              bucket,
              file_name,
              cloud_init_data,
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
    ),
  );

  app.post('/api/v1/job', hasSecret(secret), asyncResponse(
    withDatabaseConnection(
      pool,
      async (req, res, connection) => {
        const bucket = 'video.twopats.live';
        const fileName = 'encodes/test.mp4';

        const jobFile = await commandFromJob(storage, {
          bucket,
          fileName,
          encoderId: 'standalone',
          clips: [
            // ['2019-06-19/18_12_50', '2019-06-19/18_50_00'],
            ['2019-06-19/18_51_00', '2019-06-19/19_13_00'],
          ],
          fps: 25,
          profile: 'atsc_1080p_25',
        });
        const id = shortid.generate();

        console.log('inserting', id);

        const insert = sql`
          INSERT INTO job (
            job_id,
            bucket,
            file_name,
            cloud_init_data,
            status,
            created_at,
            updated_at,
            cloud_instance_id,
            secret
          ) VALUES (
            ${id},
            ${bucket},
            ${fileName},
            ${jobFile},
            'NEW',
            now(),
            now(),
            NULL,
            ${nanoid(48)}
          )
        `;

        await connection.query(insert);

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
