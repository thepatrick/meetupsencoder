const {
  timeFromFileName,
  filesByStartTime,
  meltTracksForStartAndEndTime,
  createMeltCommand
} = require('./utils')

const melt = '/Applications/Shotcut.app/Contents/MacOS/melt'
const fps = 25
const profile = `hdv_720_25p`
const videoFilesRoot = '/Users/patrick/Downloads/standalone'

const { spawn } = require('child_process')

const jobs = [
  {
    fileName: 'test1.mp4',
    clips: [
      ['2019-03-04/19_55_50', '2019-03-04/19_55_58'],
      ['2019-03-04/19_55_58', '2019-03-04/19_56_37']
    ]
  },
  {
    fileName: 'test2.mp4',
    clips: [
      ['2019-03-04/19_58_01', '2019-03-04/20_15_06']
    ]
  },
  {
    fileName: 'test3.mp4',
    clips: [
      ['2019-03-04/20_15_06', '2019-03-04/20_27_55']
    ]
  }
]

function runCommand (cmd, args) {
  return new Promise((resolve, reject) => {
    console.log('Starting', cmd, args)

    const ps = spawn(cmd, args, {
      cwd: process.cwd(),
      env: process.env
    })

    ps.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })

    ps.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`)
    })

    ps.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Unexpected exit code ${code}`))
      }
    })
  })
}

async function main () {
  const files = await filesByStartTime(videoFilesRoot)
  const cmds = jobs.map(job => {
    const clips = job.clips.map(([start, end]) => (
      meltTracksForStartAndEndTime(
        videoFilesRoot,
        files,
        fps,
        timeFromFileName(start),
        timeFromFileName(end)
      )
    ))

    const cmd = createMeltCommand(melt, profile, clips, job.fileName, 'aac', 'libx264')
    console.log(cmd.join(' '))

    return cmd
  })

  await Promise.all(
    cmds.map(runCommand.bind(null, melt))
  )

  // for (let args of cmds) {
  //   await runCommand(melt, args)
  // }

  console.log('All done')
}

main()
  .catch(err => console.error(err))

// console.log(meltCmd.join(' '))
