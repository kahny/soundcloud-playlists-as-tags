function Track(sequelize, DataTypes){
  var Track = sequelize.define('track',{
    name: DataTypes.STRING,
    track_link: DataTypes.STRING,
    tag: DataTypes.STRING,
    userId: {
        type: DataTypes.INTEGER, 
        foreignKey: true,
    }
  },

    {
      classMethods: {
        associate: function(db) {
          Track.belongsTo(db.user);
        },
        createNewTrack: function(tracklink, tag, title, user) {
            Track.create({
              track_link: tracklink,
              tag: tag,
              name: title,
              userId: user 

        })  //close create new ueser 
      }
    } 
  
})
return Track;
}
module.exports = Track;

