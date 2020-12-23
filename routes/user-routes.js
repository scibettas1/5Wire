var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {

  var session;
  // Get all users -- user for when checking a login
  // app.get("/api/users", function(req, res) {
  //   db.user.findAll({
  //     include: [db.playlist]
  //   }).then(function(dbUser) {
  //     res.json(dbUser);
  //   });
  // });

  // grab a specfic user from the db
  app.get("/api/users/:id", function(req, res) {
    db.user.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(dbUser) {
      res.json(dbUser);
    });
  });


    // grab a specfic user from the db by name & pw to validate login
    app.get("/api/login/:username/:password", function(req, res) {
      db.user.findOne({
        where: {
          username: req.params.username,
          password: req.params.password

        }
      }).then(function(dbUser) {
        res.json(dbUser);
        session = dbUser.id;
      });
    });

  // app.post("/api/login", passport.authenticate("local"), function(req, res) {
  //   res.json(req.user);
  // });

  // //route for logging a user out
  // app.get("/logout", function(req, res) {
  //   req.logout();
  //   res.redirect("/");
  // });

  // grab all the playlists a specific user has
  app.get("/api/users/:id/playlists", function(req, res) {
    db.user.findAll({
      attributes: ['username', 'id'],
      where: {
        id: req.params.id
      },
      include: {
        model: db.playlist
      }
    }).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  // create a new user
  app.post("/api/users", function(req, res) {
    db.user.create(req.body).then(function(dbUser) {
      res.json(dbUser);
      session = dbUser.id;
    });
  });

  app.get("/api/session", function(req,res){
    res.json(session);
  })

  // update an existing user
  app.put("/api/users", function(req, res) {
    db.user.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  //route for signing up a user.
  // app.post("/api/signup", function(req, res) {
  //   db.user.create({
  //     username: req.body.username,
  //     password: req.body.password
  //   })
  //     .then(function() {
  //       res.redirect(307, "/api/login");
  //     })
  //     .catch(function(err) {
  //       res.status(401).json(err);
  //     });
  // });

  // delete an existing user
  app.delete("/api/users/:id", function(req, res) {
    db.user.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbUser) {
      res.json(dbUser);
    });
  });

};
