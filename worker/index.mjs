import { Worker } from '../common/node-resque'
import connection from '../common/connection-details'
import jobs from './jobs'

async function boot () {
  // /////////////////
  // START A WORKER //
  // /////////////////

  const worker = new Worker({ connection, queues: ['encode'] }, jobs)
  await worker.connect()
  worker.start()

  process.on('SIGINT', async function () {
    console.log('Shutting down...')
    await worker.end()
  })

  // //////////////////////
  // REGISTER FOR EVENTS //
  // //////////////////////

  worker.on('start', () => { console.log('worker started') })
  worker.on('end', () => { console.log('worker ended') })
  worker.on('cleaning_worker', (worker, pid) => { console.log(`cleaning old worker ${worker}`) })
  // worker.on('poll', (queue) => { console.log(`worker polling ${queue}`) })
  // worker.on('ping', (time) => { console.log(`worker check in @ ${time}`) })
  worker.on('job', (queue, job) => { console.log(`working job ${queue} ${JSON.stringify(job)}`) })
  worker.on('reEnqueue', (queue, job, plugin) => { console.log(`reEnqueue job (${plugin}) ${queue} ${JSON.stringify(job)}`) })
  worker.on('success', (queue, job, result) => { console.log(`job success ${queue} ${JSON.stringify(job)} >> ${result}`) })
  worker.on('failure', (queue, job, failure) => { console.log(`job failure ${queue} ${JSON.stringify(job)} >> ${failure}`) })
  worker.on('error', (error, queue, job) => { console.log(`error ${queue} ${JSON.stringify(job)}  >> ${error}`) })
  // worker.on('pause', () => { console.log('worker paused') })
}

boot()

// and when you are done
// await worker.end()
