const {
  commandFromJob,
  runCommand
} = require('./utils')

const melt = process.env.MELT_CMD || '/Applications/Shotcut.app/Contents/MacOS/melt'

const jobs = [
  {
    fileName: 'test1.mp4',
    profile: 'hdv_720_25p',
    fps: 25,
    videoFilesRoot: '/Users/patrick/Downloads/standalone',
    clips: [
      ['2019-03-04/19_55_50', '2019-03-04/19_55_58'],
      ['2019-03-04/19_55_58', '2019-03-04/19_56_37']
    ]
  },
  {
    fileName: 'test2.mp4',
    profile: 'hdv_720_25p',
    fps: 25,
    videoFilesRoot: '/Users/patrick/Downloads/standalone',
    clips: [
      ['2019-03-04/19_58_01', '2019-03-04/20_15_06']
    ]
  },
  {
    fileName: 'test3.mp4',
    profile: 'hdv_720_25p',
    fps: 25,
    videoFilesRoot: '/Users/patrick/Downloads/standalone',
    clips: [
      ['2019-03-04/20_15_06', '2019-03-04/20_27_55']
    ]
  }
]

async function main () {
  await Promise.all(
    jobs.map(async job => runCommand(melt, await commandFromJob(job)))
  )
  console.log('All done')
}

main()
  .catch(err => console.error(err))
