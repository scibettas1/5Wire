$(document).ready(function () {

    var userId;
    var pl;

    // Get he user's ID and dynamically fill in account page
    $.ajax("/api/session", {
        type: "GET"
    }).then(
        function (results) {
            userId = results;
            console.log(userId);

            $.ajax(`/api/users/${userId}/playlists`, {
                type: "GET"
            }).then(function (results) {
                pl = results[0];
                console.log(pl);

                // fill the header
                $('#pi').text(`${pl.username}'s 5Wire`);
                console.log(pl.username)
                // list all the playlists a user has
                for (let i = 0; i < pl.playlists.length; i++) {
                    let row = `<div class="uk-card uk-card-primary uk-card-hover uk-card-body uk-light">
                    <h3 id="${pl.playlists[i].id}">${pl.playlists[i].title}</h3>
                    <a class="uk-button view-edit" href="/playlist/${pl.playlists[i].id}">View/Edit</a>
                    <a class="uk-button delPlay" data-playlistid='${pl.playlists[i].id}' href="/playlist/${pl.playlists[i].id}">Delete</a></div>
                    </div>`
                    $('#userPlaylists').append(row);
                    console.log(pl.playlists)
        
                }

            });
        }
    );



    $("#createPlaylist").on("click", function (event) {

        event.preventDefault()
        //   console.log('TEST CREATE USER');

        // take the form data
        var newPlaylist = {
            title: $("#title").val().trim(),
            description: $("#desc").val().trim(),
            userId: userId,
            category: "Test"
        };

        console.log(newPlaylist);

        // Send the POST request.
        $.ajax("/api/playlists", {
            type: "POST",
            data: newPlaylist
        }).then(
            function (res) {
                console.log("created new playlist");
                // redirect to new playlist's page
                window.location.replace(`/playlist/${res.id}`);
            }
        );
    });

        // Function for deleting a playlist
        $(document).on("click", ".delPlay", function () {
            console.log('clicked');
            //targets playlist that was clicked
            let deleted = $(this).data("playlistid");
            console.log(deleted);
            //ajax call to delete a playlist
            $.ajax("/api/playlists/" + deleted, {
                type: "DELETE"
            }).then(
                function () {
                    console.log("deleted id ", deleted);
                    location.reload();
                }
            );
        });
    

})

