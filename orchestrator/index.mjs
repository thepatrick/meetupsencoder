import createSchedulator from './scheduler'
import createRestAPI from './api'
import { Queue } from '../common/node-resque'
import connection from '../common/connection-details.mjs'

async function boot () {
  const queue = new Queue({ connection })
  const scheduler = createSchedulator(connection)
  const api = createRestAPI(queue)

  queue.on('error', function (error) { console.log(new Date(), error) })

  process.on('SIGINT', async function () {
    console.log(new Date(), 'Shutting down...')
    await scheduler.terminate()
    await api.terminate()
    await queue.end()
  })

  await Promise.all([
    scheduler.boot(),
    queue.connect(),
    api.boot(process.env.HTTP_PORT || 8181)
  ])

  console.log(new Date(), 'Ready to go')
}

boot()

// schedule.scheduleJob('10,20,30,40,50 * * * * *', async () => { // do this job every 10 seconds, CRON style
//   // we want to ensure that only one instance of this job is scheduled in our environment at once,
//   // no matter how many schedulers we have running
//   if(scheduler.master){
//     console.log(">>> enquing a job");
//     await queue.enqueue('time', "ticktock", new Date().toString() );
//   }
// });
