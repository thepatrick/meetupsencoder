exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createType('job_status', [
    'NeedsEncoder',
    'EncoderCreating',
    'EncoderCreated',
    'EncoderDownloading',
    'Encoding',
    'Uploading',
    'Finished',
    'Failed'
  ])

  pgm.createTable('job', {
    jobId: { type: 'char(16)', notNull: true, primaryKey: true },
    bucket: { type: 'varchar(255)', notNull: true },
    fileName: { type: 'varchar(255)', notNull: true },
    cloudInitData: { type: 'json', notNull: true },
    status: { type: 'job_status', notNull: true },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()')
    },
    updatedAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()')
    },
    cloudInstanceName: { type: 'varchar(255)' },
    secret: { type: 'char(48)', notNull: true }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('job')
  pgm.dropType('job_status')
}
