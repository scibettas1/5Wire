var express = require("express");

var app = express();
var PORT = process.env.PORT || 8080;

// Require the models to reflect our database tables
var db = require("./models");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use the public directory to grab the client-side files
app.use(express.static("public"));

// Routes for interacting with the DB
require("./routes/user-routes.js")(app);
require("./routes/playlist-routes.js")(app);
require("./routes/html-routes.js")(app);

// Connect to the DB
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});

const env = require('dotenv');
env.config();
