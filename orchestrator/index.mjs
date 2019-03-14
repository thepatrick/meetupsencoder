import { Scheduler } from '../common/node-resque'

import connection from '../common/connection-details.mjs'

async function boot () {
  // ////////////////////
  // START A SCHEDULER //
  // ////////////////////

  const scheduler = new Scheduler({ connection })
  await scheduler.connect()
  scheduler.start()

  process.on('SIGINT', async function () {
    console.log('Do something useful here.')
    await scheduler.end()
  })

  // //////////////////////
  // REGISTER FOR EVENTS //
  // //////////////////////
  scheduler.on('start', () => { console.log('scheduler started') })
  scheduler.on('end', () => { console.log('scheduler ended') })
  scheduler.on('poll', () => { console.log('scheduler polling') })
  scheduler.on('master', (state) => { console.log('scheduler became master') })
  scheduler.on('cleanStuckWorker', (workerName, errorPayload, delta) => { console.log(`failing ${workerName} (stuck for ${delta}s) and failing job ${errorPayload}`) })
  scheduler.on('error', (error) => { console.log(`scheduler error >> ${error}`) })
  scheduler.on('workingTimestamp', (timestamp) => { console.log(`scheduler working timestamp ${timestamp}`) })
  scheduler.on('transferredJob', (timestamp, job) => { console.log(`scheduler enquing job ${timestamp} >> ${JSON.stringify(job)}`) })
}

boot()
// and when you are done
// await scheduler.end()

// schedule.scheduleJob('10,20,30,40,50 * * * * *', async () => { // do this job every 10 seconds, CRON style
//   // we want to ensure that only one instance of this job is scheduled in our environment at once,
//   // no matter how many schedulers we have running
//   if(scheduler.master){
//     console.log(">>> enquing a job");
//     await queue.enqueue('time', "ticktock", new Date().toString() );
//   }
// });
