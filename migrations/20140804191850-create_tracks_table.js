module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.createTable('tracks', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      // REQUIRED: createdAt and updatedAt
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      name: DataTypes.STRING,
      track_link: DataTypes.STRING,
      tag: DataTypes.STRING,
      userId: {
      	type: DataTypes.INTEGER, 
      	foreignKey: true,
      }
    })
    .complete(done);
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    migration.dropTable('tracks')
    .complete(done);
  }
}
