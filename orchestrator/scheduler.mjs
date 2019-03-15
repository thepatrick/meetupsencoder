import { Scheduler } from '../common/node-resque'

class Schedulator {
  async boot (connection) {
    // ////////////////////
    // START A SCHEDULER //
    // ////////////////////

    this.scheduler = new Scheduler({ connection })
    await this.scheduler.connect()
    this.scheduler.start()

    // //////////////////////
    // REGISTER FOR EVENTS //
    // //////////////////////
    this.scheduler.on('start', () => { console.log(new Date(), 'scheduler started') })
    this.scheduler.on('end', () => { console.log(new Date(), 'scheduler ended') })
    // this.scheduler.on('poll', () => { console.log('scheduler polling') })
    this.scheduler.on('master', (state) => { console.log(new Date(), 'scheduler became master') })
    this.scheduler.on('cleanStuckWorker', (workerName, errorPayload, delta) => { console.log(new Date(), `failing ${workerName} (stuck for ${delta}s) and failing job ${errorPayload}`) })
    this.scheduler.on('error', (error) => { console.log(new Date(), `scheduler error >> ${error}`) })
    this.scheduler.on('workingTimestamp', (timestamp) => { console.log(new Date(), `scheduler working timestamp ${timestamp}`) })
    this.scheduler.on('transferredJob', (timestamp, job) => { console.log(new Date(), `scheduler enquing job ${timestamp} >> ${JSON.stringify(job)}`) })
  }

  async terminate () {
    if (this.scheduler) {
      await this.scheduler.end()
      this.scheduler = null
    }
  }
}

export default function createSchedulator (connection) {
  return new Schedulator(connection)
}
