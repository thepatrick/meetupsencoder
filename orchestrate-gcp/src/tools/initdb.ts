import { sql } from 'slonik';
import { createDatabasePool } from '../db';
import { asyncMain } from '../utils/asyncMain';

const sqlStatements = [
  sql`
    DROP TABLE IF EXISTS job;
  `,
  sql`
    CREATE TABLE IF NOT EXISTS job (
      job_id varchar(16) NOT NULL PRIMARY KEY,
      bucket varchar(255) NOT NULL,
      file_name varchar(255) NOT NULL,
      cloud_init_data json NOT NULL,
      status varchar(255) NOT NULL,
      created_at timestamp NOT NULL,
      updated_at timestamp NOT NULL,
      cloud_instance_id varchar(255),
      secret char(48) NOT NULL
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
