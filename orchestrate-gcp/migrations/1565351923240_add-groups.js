exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('group', {
    groupId: { type: 'char(16)', notNull: true, primaryKey: true },
    brand: { type: 'varchar(255)', notNull: true },
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
  });

  pgm.createTable('group_user', {
    groupId: { type: 'char(16)', notNull: true },
    userSub: { type: 'varchar(255)', notNull: true },
  });

  pgm.createIndex('group_user', ['groupId', 'userSub']);
};

exports.down = (pgm) => {
  pgm.dropIndex('group_user', ['groupId', 'userSub']);
  pgm.dropTable('group');
};
