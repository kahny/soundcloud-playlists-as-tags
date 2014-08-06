module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      // REQUIRED: createdAt and updatedAt
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      email: {
    		type: DataTypes.STRING,
    		unique: true,
    		allowNull: false,
    	},
      password: {
    		type: DataTypes.STRING,
    		allowNull: false
    	}   
    })
    .complete(done);
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    migration.dropTable('users')
    .complete(done);
  }
}
