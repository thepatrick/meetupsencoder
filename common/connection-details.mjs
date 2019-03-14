// ////////////////////////
// SET UP THE CONNECTION //
// ////////////////////////

const connectionDetails = {
  pkg: 'ioredis',
  host: process.env.REDIS_HOST || '127.0.0.1',
  password: null,
  port: 6379,
  database: (process.env.REDIS_DATABASE !== null && parseInt(process.env.REDIS_DATABASE, 10)) || 0
  // namespace: 'resque',
  // looping: true,
  // options: {password: 'abc'},
}

export default connectionDetails
