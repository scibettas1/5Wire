module.exports = function(sequelize, DataTypes) {
    var playlist = sequelize.define("playlist", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              len: [1]
            }
          },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [1]
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              len: [1]
            }
          }
    });

  // connect playlist to a user
    playlist.associate = function(models) {
        playlist.belongsTo(models.user, {
          foreignKey: {
            allowNull: false
          }
        });
      };

  
    // connect playlist to songs
      playlist.associate = function(models) {
        playlist.belongsToMany(models.song, {as: 'playlistSong', through: 'playlist_song', foreignKey: 'playlistId'});
      };  

    return playlist;
  };
  