import Compute from '@google-cloud/compute';
import { Storage } from '@google-cloud/storage';
import { isNil } from 'ramda';
import { isNumber } from 'util';
import { createDatabasePool } from './db';
// import { sessionAuth } from './middleware/sessionAuth';
import { registerRoutes } from './routes';
import express = require('express');

const app = express();

const port = !isNil(process.env.PORT) && parseInt(process.env.PORT, 10); // default port to listen

if (!isNumber(port)) {
  throw new Error('Missing PORT');
}

const secret = !isNil(process.env.ME_SECRET) &&
  process.env.ME_SECRET.length > 10 &&
  process.env.ME_SECRET;

if (!secret) {
  throw new Error('Missing ME_SECRET (or not long enough)');
}

const bucket = !isNil(process.env.GOOGLE_STORAGE_BUCKET) &&
  process.env.GOOGLE_STORAGE_BUCKET.length > 0 &&
  process.env.GOOGLE_STORAGE_BUCKET;

if (!bucket) {
  throw new Error('Missing GOOGLE_STORAGE_BUCKET');
}

const selfUrl = !isNil(process.env.ME_SELF_URL) &&
  process.env.ME_SELF_URL.length > 0 &&
  process.env.ME_SELF_URL;

if (!selfUrl) {
  throw new Error('Missing ME_SELF_URL');
}

app.use(express.json());

const pool = createDatabasePool();
const storage = new Storage();
const compute = new Compute();

// sessionAuth(app);
registerRoutes(app, pool, compute, storage, secret, bucket, selfUrl);

// start the Express server
app.listen(port, (err?: Error) => {
  if (err !== undefined) {
    console.error(err);
    process.exit(1);
  }
  console.log(`server started at http://localhost:${port}`);
});
