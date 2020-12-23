module.exports = function(sequelize, DataTypes) {
    var playlist_song = sequelize.define("playlist_song", {

    });

    // this table is joint table to bring together songs and playlists with a many-to-many relationship on both ends
    // this has FKs to both tables of playlists and songs
  

    return playlist_song;
  };
  