// ///////////////////////////
// DEFINE YOUR WORKER TASKS //
// ///////////////////////////

import { commandFromJob, runCommand } from './utils'

const melt = process.env.MELT_CMD || '/Applications/Shotcut.app/Contents/MacOS/melt'

const jobs = {
  // 'add': {
  //   plugins: ['JobLock'],
  //   pluginOptions: {
  //     JobLock: {}
  //   }, ...
  // },
  'encode': {
    perform: async (job) => {
      await runCommand(melt, await commandFromJob(job))
      return job.fileName
    }
  }
}

export default jobs
