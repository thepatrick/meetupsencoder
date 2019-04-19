import { Queue } from '../common/node-resque'

import connection from '../common/connection-details.mjs'

const work = [
  {
    fileName: 'test1.mp4',
    profile: 'hdv_720_25p',
    fps: 25,
    videoFilesRoot: '/Users/patrick/Downloads/standalone',
    clips: [
      ['2019-03-04/19_55_50', '2019-03-04/19_55_58'],
      ['2019-03-04/19_55_58', '2019-03-04/19_56_37']
    ]
  }
  // {
  //   fileName: 'test2.mp4',
  //   profile: 'hdv_720_25p',
  //   fps: 25,
  //   videoFilesRoot: '/Users/patrick/Downloads/standalone',
  //   clips: [
  //     ['2019-03-04/19_58_01', '2019-03-04/20_15_06']
  //   ]
  // },
  // {
  //   fileName: 'test3.mp4',
  //   profile: 'hdv_720_25p',
  //   fps: 25,
  //   videoFilesRoot: '/Users/patrick/Downloads/standalone',
  //   clips: [
  //     ['2019-03-04/20_15_06', '2019-03-04/20_27_55']
  //   ]
  // }
]

async function main () {
  const queue = new Queue({ connection })
  queue.on('error', function (error) { console.log(error) })
  await queue.connect()

  process.on('SIGINT', async function () {
    console.log('Do something useful here.')
    await queue.end()
  })

  await Promise.all(
    work.map(async job => queue.enqueue('encode', 'encode', job))
  )

  console.log('All done')
  await queue.end()
}

main()
  .catch(err => console.error(err))
