import _ from 'lodash'
import { readdir } from 'fs'
import moment from 'moment'
import { basename, dirname, join, extname } from 'path'
import { promisify } from 'util'
import { spawn } from 'child_process'

const readdirAsync = promisify(readdir)
const { unix } = moment
const { flatten } = _

function timeFromFileName (filePath) {
  const fileTime = basename(filePath, '.ts')
  const fileDirectory = dirname(filePath)
  return moment(fileDirectory + ' ' + fileTime, 'YYYY-MM-DD HH_mm_ss').unix()
}

function fileNameFromTime (time) {
  return unix(time).format('YYYY-MM-DD/HH_mm_ss') + '.ts'
}

function findSourcesForClip (videoFilesRoot, files, fps, start, end) {
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
    let cmd = [join(videoFilesRoot, fileNameFromTime(file))]
    if (file < start) {
      cmd.push('in=' + ((start - file)) * fps)
    }

    if (index === pickedFiles.length - 1) {
      cmd.push('out=' + ((end - file)) * fps)
    }

    return cmd
  })

  return flatten(meltFiles)
}

async function createVideoFileFinder (videoFilesRoot) {
  const dayDirectories = (await readdirAsync(videoFilesRoot, { withFileTypes: true }))
    .filter(f => f.isDirectory())

  const allFiles = await Promise.all(
    dayDirectories.map(async d => (
      (await readdirAsync(join(videoFilesRoot, d.name), { withFileTypes: true }))
        .filter(f => f.isFile() && extname(f.name) === '.ts')
        .map(f => join(videoFilesRoot, d.name, f.name))
    ))
  )

  const flatFiles = flatten(allFiles).map(timeFromFileName)

  return findSourcesForClip.bind(null, videoFilesRoot, flatFiles)
}

function createMeltCommand (profile, sources, outputFilename, audioCodec = 'aac', videoCodec = 'libx264') {
  return [
    '-profile', profile
    // '-progress'
  ].concat(flatten(sources))
    .concat([
      '-consumer', `avformat:${outputFilename}`, `acodec=${audioCodec}`, `vcodec=${videoCodec}`
    ])
}

export function runCommand (cmd, args) {
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

export async function commandFromJob ({ videoFilesRoot, clips, fps, profile, fileName }) {
  const findSources = await createVideoFileFinder(videoFilesRoot)

  const sources = clips.map(([start, end]) => (
    findSources(fps, timeFromFileName(start), timeFromFileName(end))
  ))

  return createMeltCommand(profile, sources, fileName, 'aac', 'libx264')
}
