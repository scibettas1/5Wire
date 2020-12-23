$(document).ready (function(){

    // grab all songs to use as needed for validation
    var allSongs;
    $.ajax("/api/songs", {
        type: "GET"
    }).then (function(results) {
        allSongs = results;
        console.log(allSongs)
    });

    // function to send a new user to db
    $("#createUser").on("submit", function(event) {

      event.preventDefault()
    //   console.log('TEST CREATE USER');
    
        var newUser = {
          username: $("#userName").val().trim(),
          password: $("#pw").val().trim(),
        };
  
        console.log(newUser);
    
        // Send the POST request.
        $.ajax("/api/users", {
          type: "POST",
          data: newUser
        }).then(
          function() {
            console.log("created new user");
            // need to decide where to redirect users
            location.reload();
          }
        );
      });

      // function to validate a login
    $("#login").on("submit", function(event) {

        event.preventDefault()
      //   console.log('TEST CREATE USER');
      
          var user = {
            username: $("#un").val().trim(),
            password: $("#pw2").val().trim()
          };

      
          // Send the POST request.
          if (user) {
            console.log(user);
            $.ajax(`/api/login/${user.username}/${user.password}`, {
                type: "GET",
                data: user
              }).then(
                function(results) {
                    if (results === null) {
                        console.log('Invalid login results')
                    }
                    else if (results.username === user.username && results.password === user.password) {
                        console.log('Good!');
                    }
                    else {
                        console.log('no match');
                    }
                }
              );
          }
  
        });
  
    $("#createPlaylist").on("submit", function(event) {

        event.preventDefault()
        //   console.log('TEST CREATE USER');
        
            var newPlaylist = {
            title: $("#title").val().trim(),
            description: $("#desc").val().trim(),
            userId: $('#userId').val().trim(),
            category: "Test"
            };
    
            console.log(newPlaylist);
        
            // Send the POST request.
            $.ajax("/api/playlists", {
            type: "POST",
            data: newPlaylist
            }).then(
            function() {
                console.log("created new playlist");
                // need to decide where to redirect users
                location.reload();
            }
            );
        });
  
    // need to create some validation over if a song already exists or not
    $("#addSong").on("submit", function(event) {

        event.preventDefault()
        //   console.log('TEST CREATE USER');
        
            var newSong = {
            title: $("#songTitle").val().trim(),
            artist: $("#artist").val().trim(),
            album: $('#album').val().trim(),
            genre: $('#genre').val().trim(),
            playlistId: $('#playlistId').val().trim(),
            };

            var querySong = {    
                title: $("#songTitle").val().trim(),
                artist: $("#artist").val().trim(),
                album: $('#album').val().trim()
            }
            console.log(querySong);

            var match;
            var oldId;

            for (let i=0; i < allSongs.length; i++) {
                if (querySong.title === allSongs[i].title && querySong.artist === allSongs[i].artist && querySong.album === allSongs[i].album ) {
                    match = true
                    oldId = allSongs[i].id
                }
                else {
                    match = false;
                }
            }

            if (match === true) {
                $.ajax("/api/ps", {
                    type: "POST",
                    data: {playlistId: newSong.playlistId, songId: oldId}
                })
            }
            else {
                $.ajax("/api/songs", {
                    type: "POST",
                    data: newSong
                    }).then(
                    function(results) {
                        console.log("created new song");
                        // need to decide where to redirect users
                        location.reload();
                    }
                    );
            }
    
            // console.log(newSong);
     

            // $.ajax("/api/songs", {
            //     type: "GET",
            //     data: querySong
            // }).then(function(results){
            //     if (results === null) {
            //     // Send the POST request.
            //     $.ajax("/api/songs", {
            //         type: "POST",
            //         data: newSong
            //         }).then(
            //         function(results) {
            //             console.log(results);
            //             // need to decide where to redirect users
            //             // location.reload();
            //             }
            //         );
            //     }
            //     else {
            //         $.ajax("/api/ps", {
            //             type: "POST",
            //             data: {playlistId: newSong.playlistId, songId: results.id}
            //         })
            //     }
            // })
        
        });


    // Grab spotify tokens and make a call 
    $("#spotify").on("submit", function(event){
        event.preventDefault();

        // Get the values from the search form
        var type = $('#type').val().trim().toLowerCase();
        var search = $('#search').val().trim();
        search = search.replace(/ /g, '%20');
        console.log(search, type);

       // make an ajax call to get the spotify tokens
       // then make spotify call for data
       // then append html with data
        $.ajax("/api/tokens", {
            type: "GET"
        }).then(function(key){
            $.ajax(`https://api.spotify.com/v1/search?q=${search}&limit=10&type=${type}`, {
                type: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `${key.tokenType} ${key.accessToken}`
                }
            }).then(function(results){
                console.log(results)
                var spot;
                var spotDiv = $('#spotResults');

                if (type === 'artist'){
                    spot = results.artists.items;
                    spotDiv.empty();

                    // header
                    var resultTable = `<h4>Results</h4><table id="table"><tr><th>Artist</th><th>Followers</th><th>Actions</th><th>Actions</th></tr></table>`;
                    spotDiv.append(resultTable);

                    // append rows
                    for (let i=0; i < spot.length; i++) {
                        let row = `<tr>
                            <td>${spot[i].name}</td>
                            <td>${spot[i].followers.total}</td>
                            <td><button class="viewAlb">View Albums</button></td>
                            <td><button class="viewSongs">View Albums</button></td>
                        </tr>`;

                        $('#table').append(row);

                    }
                }
                else if (type === 'track') {
                    spot = results.tracks.items;
                    spotDiv.empty();

                    // table header
                    var resultTable = `<h4>Results</h4><table id="table"><tr><th>Track</th><th>Artist</th><th>Album</th><th>Actions</th></tr></table>`;
                    spotDiv.append(resultTable);

                    // table rows
                    for (let i=0; i < spot.length; i++) {
                        let row = `<tr>
                            <td>${spot[i].name}</td>
                            <td>${spot[i].album.name}</td>
                            <td>${spot[i].artists[0].name}</td>
                            <td><button class="addBtn">Add Song</button></td>
                        </tr>`;

                        $('#table').append(row);

                    }
                }
                else {
                    spot = results.albums.items;
                    spotDiv.empty();

                    // table header
                    var resultTable = `<h4>Results</h4><table id="table"><tr><th>Track</th><th>Artist</th><th>Album</th><th>Actions</th></tr></table>`;
                    spotDiv.append(resultTable);

                    // table rows
                    for (let i=0; i < spot.length; i++) {
                        let row = `<tr>
                            <td>${spot[i].name}</td>
                            <td>${spot[i].artists[0].name}</td>
                            <td><img src=${spot[i].images[2].url}></td>
                            <td><button class="addBtn">View Songs</button></td>
                        </tr>`;

                        $('#table').append(row);

                    }
                }

                
        
            });
            
        })

    })

})
  
  