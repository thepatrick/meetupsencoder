exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createType('worker_queue_action', [
    'Create',
    'Destroy'
  ])

  pgm.createTable('worker_queue', {
    workerQueueItemId: { type: 'char(16)', notNull: true, primaryKey: true },
    retriesRemaining: { type: 'int', notNull: true, default: 3 },
    timeCreated: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()')
    },
    jobId: { type: 'char(16)', notNull: true },
    action: { type: 'worker_queue_action', notNull: true }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('worker_queue')
  pgm.dropType('worker_queue_action')
}
