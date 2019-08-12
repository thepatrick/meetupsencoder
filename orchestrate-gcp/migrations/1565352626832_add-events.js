exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('event', {
    eventId: { type: 'char(16)', notNull: true, primaryKey: true },
    groupId: { type: 'char(16)', notNull: true },
    name: { type: 'varchar(255)', notNull: true },
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
    startTime: {
      type: 'timestamp',
      notNull: true,
    },
    endTime: {
      type: 'timestamp',
      notNull: true,
    }
  });

  pgm.createTable('talk', {
    talkId: { type: 'char(16)', notNull: true, primaryKey: true },
    groupId: { type: 'char(16)', notNull: true },
    eventId: { type: 'char(16)', notNull: true },
    title: { type: 'varchar(255)', notNull: true },
    fps: { type: 'int', notNull: true },
  });

  pgm.createTable('talk_presenter', {
    talkPresenterId: { type: 'char(16)', notNull: true, primaryKey: true },
    talkId: { type: 'char(16)', notNull: true },
    email: { type: 'varchar(255)', notNull: true },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('talk_presenter');
  pgm.dropTable('talk');
  pgm.dropTable('event');
};
