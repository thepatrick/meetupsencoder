const _ = require('lodash')
const fs = require('fs')
const moment = require('moment')
const path = require('path')
const util = require('util')
const { spawn } = require('child_process')

const readdirAsync = util.promisify(fs.readdir)

function timeFromFileName (filePath) {
  const fileTime = path.basename(filePath, '.ts')
  const fileDirectory = path.dirname(filePath)
  const t = moment(fileDirectory + ' ' + fileTime, 'YYYY-MM-DD HH_mm_ss')
  return t.unix()
}

function fileNameFromTime (time) {
  const t = moment.unix(time)
  return t.format('YYYY-MM-DD/HH_mm_ss') + '.ts'
}

async function filesByStartTime (videoFilesRoot) {
  const dayDirectories = (await readdirAsync(videoFilesRoot, { withFileTypes: true }))
    .filter(f => f.isDirectory())

  const allFiles = await Promise.all(
    dayDirectories.map(async d => {
      return (await readdirAsync(path.join(videoFilesRoot, d.name), { withFileTypes: true }))
        .filter(f => f.isFile() && path.extname(f.name) === '.ts')
        .map(f => path.join(videoFilesRoot, d.name, f.name))
    })
  )

  const files = _.flatten(allFiles).map(timeFromFileName)
  return files
}

function meltTracksForStartAndEndTime (videoFilesRoot, files, fps, start, end) {
  const pickedFiles = files.filter((element, index) => {
    if (element > end) {
      return false
    }
    if (
      element < start && // we are before the start timestamp
    index + 1 < files.length && // there are more files
    files[index + 1] < start // the next file is also before the start timestamp
    ) {
      return false
    }
    // In that case we must be one of the desired files!
    return true
  })

  const meltFiles = pickedFiles.map((file, index) => {
    let cmd = [path.join(videoFilesRoot, fileNameFromTime(file))]
    if (file < start) {
      cmd.push('in=' + ((start - file)) * fps)
    }

    if (index === pickedFiles.length - 1) {
      cmd.push('out=' + ((end - file)) * fps)
    }

    return cmd
  })

  return _.flatten(meltFiles)
}

function createMeltCommand (melt, profile, sources, outputFilename, audioCodec = 'aac', videoCodec = 'libx264') {
  return [
    '-profile', profile
    // '-progress'
  ].concat(_.flatten(sources))
    .concat([
      '-consumer', `avformat:${outputFilename}`, `acodec=${audioCodec}`, `vcodec=${videoCodec}`
    ])
}

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

module.exports = {
  timeFromFileName,
  fileNameFromTime,
  filesByStartTime,
  meltTracksForStartAndEndTime,
  createMeltCommand,
  runCommand
}
