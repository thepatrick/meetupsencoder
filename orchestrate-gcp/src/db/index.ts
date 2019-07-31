import { createPool, DatabasePoolType } from 'slonik';
// import { isString } from 'lodash';

export const createDatabasePool: () => DatabasePoolType = () => {
  const options = {
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT || '', 10),
    user: process.env.PGUSER,
  };

  const uri = [
    'postgres://',
    encodeURIComponent(`${options.user}`),
    '@',
    options.host,
    ':',
    options.port,
    '/',
    encodeURIComponent(`${options.database}`),
  ].join('');

  return createPool(uri);
};
