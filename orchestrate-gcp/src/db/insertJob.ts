import { sql, DatabasePoolConnectionType } from 'slonik';

export const insertJob = async (
  connection: DatabasePoolConnectionType,
  id: string,
  bucket: string,
  fileName: string,
  jobFile: string,
  secret: string,
) => {

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
      ${secret}
    )
  `;

  await connection.query(insert);
};
