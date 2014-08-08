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
            Track.findOrCreate({
              track_link: tracklink,
              tag: tag,
              name: title,
              userId: user 
        })    
      },//close createNewTrack
        deleteTrack: function(trackId) {
          Track.destroy({
            id:trackId
          })
        }//close deleteTrack
    }//close class methods  
  
})
return Track;
}
module.exports = Track;

