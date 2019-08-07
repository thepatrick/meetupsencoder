import { sql } from 'slonik';
import { createDatabasePool } from '../db';

const asyncMain: (fn: () => Promise<void>) => void = (fn) => {
  Promise.resolve()
    .then(() => fn())
    .catch((e: any) => {
      console.error(e);
      process.exit(1);
    });
};

const sqlStatements = [
  sql`
    DROP TABLE IF EXISTS groups
  `,
  sql`
    CREATE TABLE IF NOT EXISTS groups (
      id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      group_id varchar(50) NOT NULL,
      brand varchar(255) NOT NULL
    )
  `,
  sql`
    CREATE TABLE IF NOT EXISTS group_users (
      group_id INT NOT NULL,
      user_id varchar(255) NOT NULL
    )
  `,
  sql`
    CREATE TABLE IF NOT EXISTS events (
      event_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      group_id INT NOT NULL,
      name varchar(255) NOT NULL,
      start_time timestamp
    )
  `,
  sql`
    CREATE TABLE IF NOT EXISTS talks (
      talk_id INT NOT NULL,
      event_id INT NOT NULL,
      title varchar(255) NOT NULL,
      fps INT NOT NULL
    )
  `,
  sql`
    CREATE TABLE IF NOT EXISTS talk_presenters (
      talk_id INT NOT NULL,
      user_id varchar(255) NOT NULL,
      display_order INT NOT NULL
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
