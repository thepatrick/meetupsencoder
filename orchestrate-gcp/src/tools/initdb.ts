import { sql } from 'slonik';
import { createDatabasePool } from '../db';
import { asyncMain } from '../utils/asyncMain';

const sqlStatements = [
  sql`DROP TABLE IF EXISTS job`,
  sql`DROP TYPE IF EXISTS job_status`,
  sql`DROP TABLE IF EXISTS workerpost_queue`,
  sql`DROP TYPE IF EXISTS worker_queue_action`,
  sql`
    CREATE TYPE job_status AS ENUM (
      'NeedsEncoder',
      'EncoderCreating',
      'EncoderCreated',
      'EncoderDownloading',
      'Encoding',
      'Uploading',
      'Finished',
      'Failed'
    )
  `,
  sql`
    CREATE TABLE IF NOT EXISTS job (
      job_id              CHAR(16) NOT NULL PRIMARY KEY,
      bucket              VARCHAR(255) NOT NULL,
      file_name           VARCHAR(255) NOT NULL,
      cloud_init_data     JSON NOT NULL,
      status              job_status NOT NULL,
      created_at          TIMESTAMP NOT NULL,
      updated_at          TIMESTAMP NOT NULL,
      cloud_instance_name VARCHAR(255),
      secret              CHAR(48) NOT NULL
    )
  `,
  sql`
    CREATE TYPE worker_queue_action AS ENUM (
      'Create',
      'Destroy'
    )
  `,
  sql`
    CREATE TABLE IF NOT EXISTS worker_queue (
      worker_queue_item_id CHAR(16) NOT NULL PRIMARY KEY,
      retries_remaining    INT NOT NULL DEFAULT 3,
      time_created         TIMESTAMP DEFAULT NOW() NOT NULL,
      job_id               CHAR(16) NOT NULL,
      action               worker_queue_action NOT NULL
    )
  `,
];

asyncMain(async () => {
  const pool = createDatabasePool();
  try {

    await pool.connect(async (db) => {
      for (const statement of sqlStatements) {
        await db.query(statement);
      }
    });
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    console.log('kill db connection');
  }

  console.log('Done.');
});
