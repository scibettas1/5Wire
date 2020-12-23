//must include <script src="https://sdk.scdn.co/spotify-player.js"></script> in HTML file for this to work
let token;
let device;
$.ajax("/api/tokens", {
    type: "GET"
}).then((key) => {
    token= key.accessToken;
})
window.onSpotifyWebPlaybackSDKReady = () => { 
    //const token = 'BQBHPsZKdrK9mIsfk8KPbOx4JDRSmLAVHKNjk3jfe1bnS8B24e4y-wO34QjZZoNtwJ42d-wqdSBRvK8FoG1kpDs1UWd24bL1MV3eGdQozlc19kJCVhX_HP4UEQ2fJCbMSvjMd6scA_BzxtcKsxaUHAbnPSHK6fkrlw';
  const player = new Spotify.Player({
    name: 'Browser',
    getOAuthToken: cb => { cb(token); }
  });

  // Error handling
  player.addListener('initialization_error', ({ message }) => { console.error(message); });
  player.addListener('authentication_error', ({ message }) => { console.error(message); });
  player.addListener('account_error', ({ message }) => { console.error(message); });
  player.addListener('playback_error', ({ message }) => { console.error(message); });

  // Playback status updates
  player.addListener('player_state_changed', state => { 
    console.log(state); 
});

  // Ready
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    
    device= device_id;
    $.ajax(`https://api.spotify.com/v1/me/player`, {
                type: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                dataType: "json",
                data: JSON.stringify({
                    "device_ids": [`${device_id}`]
                })
            });
  });

  // Not Ready
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  });

  // Connect to the player!
  player.connect();
} 

$(document).ready(function () {
   // Grab spotify tokens and make a call 
  $("#searchSpotify").on("click", function (event) {
    event.preventDefault();

    // Get the values from the search form
    var type = $('#type').val().trim().toLowerCase();
    var search = $('#search').val().trim();
    search = search.replace(/\s/g, '%20');
    console.log(search, type);

    // make an ajax call to get the spotify tokens
    // then make spotify call for data
    // then append html with data
    $.ajax("/api/tokens", {
        type: "GET"
    }).then(function (key) {
        $.ajax(`https://api.spotify.com/v1/search?q=${search}&limit=10&type=${type}`, {
            type: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${key.tokenType} ${key.accessToken}`
            }
        }).then(function (results) {
            console.log(results)
            var spot;
            var spotDiv = $('#spotResults');

            if (type === 'artist') {
                spot = results.artists.items;
                spotDiv.empty();

                // header
                var resultTable = `<h4>Results</h4><table id="table"></table>`;
                spotDiv.append(resultTable);

                // append rows
                for (let i = 0; i < spot.length; i++) {
                    let row = `<tr>
                        <td>${spot[i].name}</td>
                        <td>${spot[i].followers.total}</td>
                        <td><button class="viewAlb">View Albums</button></td>
                        <td><button class="viewSongs">View Songs</button></td>
                    </tr>`;

                    $('#table').append(row);

                }
            }
            else if (type === 'track') {
                spot = results.tracks.items;
                spotDiv.empty();

                // table header
/*                 var resultTable = `<h4>Results</h4><table id="table"></table>`;
                spotDiv.append(resultTable); */

                // table rows
/*                 for (let i = 0; i < spot.length; i++) {
                    let row = `<tr>
                        <td name="title">${spot[i].name}</td>
                        <td name="album">${spot[i].album.name}<img src="${spot[i].album.images[2].url}"></td>
                        <td name="artist">${spot[i].artists[0].name}</td>
                        <td><button uri= "${spot[i].uri}" data-title="${spot[i].name}" data-album="${spot[i].album.name}" data-artist="${spot[i].artists[0].name}" id="${spot[i].id}" 
                        class="addQ" action="submit">Add Song</button></td>
                    </tr>`;

                    $('#table').append(row);

                } */
                for (let i = 0; i < spot.length; i++) {
                    let row = `<li>${spot[i].name}<br>
                        ${spot[i].artists[0].name}<br>
                        ${spot[i].album.name}<br>
                        <img src="${spot[i].album.images[2].url}"><br>
                        <button class="addQ uk-button delSong" uri= "${spot[i].uri}" data-title="${spot[i].name}" data-album="${spot[i].album.name}" data-artist="${spot[i].artists[0].name}" id="${spot[i].id}" 
                        class="addQ" action="submit">Add to Queue</button>
                        <button class="playSong uk-button add-btn" data-uri= "${spot[i].uri}" class="playSong" action="submit">Play this song</button><hr>`;
                        

                        spotDiv.append(row);

                }
            }
            else {
                spot = results.albums.items;
                spotDiv.empty();

                // table header
                var resultTable = `<h4>Results</h4><table id="table"><tr><th>Track</th><th>Artist</th><th>Album</th><th>Actions</th></tr></table>`;
                spotDiv.append(resultTable);

                // table rows
                for (let i = 0; i < spot.length; i++) {
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
// ADD NICK
  $(document).on("click", ".addQ", function () {
    let id= $(this).attr('id');
    let uri= "spotify%3Atrack%3A" + id;
    $.ajax(`https://api.spotify.com/v1/me/player/queue?uri=${uri}&device_id=${device}`, {
                type: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }).then(function() {
                if (err) throw err;
                console.log("success");
            });
  });
});

$(document).on("click", "#play", () => {
    $.ajax(`https://api.spotify.com/v1/me/player/play?device_id=${device}`, {
                    type: "PUT",
                    headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                // dataType: "json",
                // data: JSON.stringify({
                //     "uris": [`spotify:track:2D1hlMwWWXpkc3CZJ5U351`]
                // })
                });
});

$(document).on("click", "#pause", () => {
    $.ajax(`https://api.spotify.com/v1/me/player/pause?device_id=${device}`, {
                    type: "PUT",
                    headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
                });
});

$(document).on("click", ".playSong", function() {
    let uri= $(this).data('uri');
    console.log(uri);
    $.ajax(`https://api.spotify.com/v1/me/player/play?device_id=${device}`, {
                    type: "PUT",
                    headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                dataType: "json",
                data: JSON.stringify({
                    "uris": [`${uri}`]
                })
                });
})