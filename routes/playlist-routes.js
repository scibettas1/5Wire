var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
  // get all playlists  
  app.get("/api/playlists", function(req, res) {
    db.playlist.findAll({}).then(function(dbPlaylist) {
      res.json(dbPlaylist);
    });
  });

  // get a specific playlist, include author and all its songs
  app.get("/api/playlists/:id", function(req, res) {
    db.playlist.findOne({
      where: {
        id: req.params.id
      },
      include:
      [
        {
            model: db.song,
            as: 'playlistSong',
            through: 'playlist_song',
            foreignKey: 'playlistId'
        }
    ]
    }).then(function(dbPlaylist) {
      res.json(dbPlaylist);
    });
  });
  
  // create a new playlist
  app.post("/api/playlists", function(req, res) {
    db.playlist.create(req.body).then(function(dbPlaylist) {
      res.json(dbPlaylist);
    });
  });

    // create a new song and add to playlist_songs
    app.post("/api/songs", function(req, res) {
      db.song.create(req.body).then(function(dbSong) {
        let ps = {songId: dbSong.id, playlistId: req.body.playlistId}
        db.playlist_song.create(ps)
      })
    });

    app.post("/api/ps", function(req, res){
      db.playlist_song.create(req.body).then(function(db){
        res.json(db);
      })
    });

    app.delete("/api/ps", (req, res) => {
      db.playlist_song.destroy({
        where: {
          playlistId: req.body.playlistId,
          songId: req.body.songId
        }}).then((db) => {
        res.json(db);
      });
    });

    app.get("/api/songs", function(req, res) {
      db.song.findAll({attributes: ['id', 'title', 'artist', 'album']}).then(function(dbSong) {
        res.json(dbSong);
      });
    });

    // route for checking if a song matches a song already in db
    // app.get("/api/songs", function(req, res) {
    //   db.song.findOne(
    //     {attributes: ['title', 'artist', 'album']},
    //     {where: {
    //       title: req.body.title,
    //       artist: req.body.artist,
    //       album: req.body.album
    //     }
    //   }).then(function(dbSong) {
    //     res.json(dbSong);
    //   });
    // });

  // update an existing playlist
  app.put("/api/playlists", function(req, res) {
    db.playlist.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbPlaylist) {
      res.json(dbPlaylist);
    });
  });

  // delete an existing playlist
  app.delete("/api/playlists/:id", function(req, res) {
    db.playlist.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbPlaylist) {
      res.json(dbPlaylist);
    });
  });

};
