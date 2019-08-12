import Compute from '@google-cloud/compute';
import { Storage } from '@google-cloud/storage';
import { isNil } from 'ramda';
import { isNumber } from 'util';
import { createDatabasePool } from './db';
// import { sessionAuth } from './middleware/sessionAuth';
import { registerRoutes } from './routes';
import express = require('express');
import { runWorkerQueue } from './encoder/WorkerQueue/runWorkerQueue';
import pino from 'pino';
import { isNonEmptyString } from './utils/isNonEmptyString';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

const logger = pino();

const app = express();

const port = !isNil(process.env.PORT) && parseInt(process.env.PORT, 10); // default port to listen
const secret = process.env.ME_SECRET;
const bucket = process.env.GOOGLE_STORAGE_BUCKET;
const selfUrl = process.env.ME_SELF_URL;

if (!isNumber(port)) {
  logger.error('Missing PORT');
  throw new Error('Missing PORT');
}

if (!isNonEmptyString(secret)) {
  logger.error('Missing ME_SECRET');
  throw new Error('Missing ME_SECRET (or not long enough)');
}

if (!isNonEmptyString(bucket)) {
  logger.error('Missing GOOGLE_STORAGE_BUCKET');
  throw new Error('Missing GOOGLE_STORAGE_BUCKET');
}

if (!isNonEmptyString(selfUrl)) {
  logger.error('Missing ME_SELF_URL');
  throw new Error('Missing ME_SELF_URL');
}

app.use(express.json());

const pool = createDatabasePool();
const storage = new Storage();
const compute = new Compute();

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://twopats.au.auth0.com/.well-known/jwks.json',
  }),
  audience: 'https://crofter-api.twopats.live/',
  issuer: 'https://twopats.au.auth0.com/',
  algorithms: ['RS256'],
});

// sessionAuth(app);
registerRoutes(
  logger.child({ module: 'routes' }),
  app,
  pool,
  storage,
  secret,
  bucket,
  checkJwt,
);

// start the Express server
app.listen(port, (err?: Error) => {
  if (err !== undefined) {
    console.error(err);
    process.exit(1);
  }
  logger.info(
    `server started at http://localhost:${port}, ${selfUrl}`,
  );
});

runWorkerQueue(
  logger.child({ module: 'workerQueue' }),
  pool,
  compute,
  selfUrl,
  secret,
);
