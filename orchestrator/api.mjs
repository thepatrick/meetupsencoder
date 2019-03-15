import express from 'express'
import bodyParser from 'body-parser'

class RestAPI {
  constructor (queue) {
    this.queue = queue
    this.app = express()
    this.app.use(bodyParser.json())
    this.app.post('/job', this.addToQueue.bind(this))
  }

  async addToQueue (req, res, next) {
    console.log(new Date(), req.body)

    try {
      await this.queue.enqueue('encode', 'encode', req.body)
      res.json({ ok: true })
    } catch (err) {
      next(err)
    }
  }

  boot (port) {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(port, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  terminate () {
    if (this.server) {
      this.server.close()
      this.server = undefined
    }
  }
}

export default function createRestAPI (queue) {
  return new RestAPI(queue)
}
