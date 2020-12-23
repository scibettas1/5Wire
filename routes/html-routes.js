var path = require("path");
var isAuthenticated = require("../config/middleware/isAuthenticated");
var request = require('request');
var fetch= require('node-fetch');
const env = require('dotenv');

// Routes
// =============================================================
module.exports = function(app) {

  var tokens;

  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.get("/login", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
    let clientID= process.env.clientId;
    res.redirect(`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=code&redirect_uri=https://group5-proj2.herokuapp.com/query&scope=streaming%20user-modify-playback-state%20user-read-private%20user-read-email&state=34fFs29kd09`);
  });

  app.get("/query", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/test.html"));
    let regex= /code=[a-z0-9-_]+/ig;
    let url= req.url;
    let ans= url.match(regex);
    ans= ans[0].split("=")[1]; 
    getToken(ans);
    res.redirect("/sign-in")
});

function getToken(x) {
  
  var options = {
    'method': 'POST',
    'url': 'https://accounts.spotify.com/api/token',
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    form: {
      'grant_type': 'authorization_code',
      'code': x,
      'client_secret': process.env.clientSecret,
      'client_id': '47574acd314042f0b65d7125bdbf9e12',
      'redirect_uri': 'https://group5-proj2.herokuapp.com/query'
    }
  };

  request(options, function (error, response) {
    if (error) throw error;
    let toke= JSON.parse(response.body);
    let apiKeys= {
      accessToken: toke["access_token"],
      tokenType: toke["token_type"],
      refreshToken: toke["refresh_token"]
    }
    console.log(apiKeys);
    // finalCall(apiKeys);
    tokens = apiKeys;
  });
  console.log(tokens);
}

app.get("/test", function(req, res){
  res.sendFile(path.join(__dirname, "../public/test.html"));
})


app.get("/api/tokens", function(req, res){
  res.json(tokens);
})

app.get("/join", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
  let clientID= "47574acd314042f0b65d7125bdbf9e12";
  res.redirect(`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=code&redirect_uri=https://group5-proj2.herokuapp.com/query&scope=user-modify-playback-state%20streaming%20user-read-private%20user-read-email&state=34fFs29kd09`);
});

app.get("/sign-up", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/join.html"));
});

  app.get("/forgot", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/forgot-password.html"));
  });

  app.get("/sign-in", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

    app.get("/account", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/account.html"));
  });

  app.get("/create", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/create-playlist.html"));
  });

  app.get("/jukebox", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/jukebox.html"));
  });

  app.get("/playlist/:id", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/playlist.html"));
  });

  // app.get("/login", function(req, res) {
  //   if (req.user) {
  //     res.redirect("/account");
  //   }
  //   res.sendFile(path.join(__dirname, "../public/login.html"));
  // });


  // app.get("/test", isAuthenticated, function(req, res) {
  //   res.sendFile(path.join(__dirname, "../public/test.html"));
  // });
  
  // app.get("/account", function(req, res) {
  //   res.sendFile(path.join(__dirname, "../public/account.html"));
  // });

  // app.get("/create", function(req, res) {
  //   res.sendFile(path.join(__dirname, "../public/create-playlist.html"));
  // });

};