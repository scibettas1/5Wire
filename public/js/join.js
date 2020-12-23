$(document).ready (function(){
    // function to send a new user to db
    $("#join").on("click", function(event) {

        event.preventDefault()
      //   console.log('TEST CREATE USER');
      
          var newUser = {
            username: $("#userName").val().trim(),
            password: $("#passWord").val().trim(),
          };
    
        //   console.log(newUser);
      
          // Send the POST request.
          $.ajax("/api/users", {
            type: "POST",
            data: newUser
          }).then(
            function() {
              alert("Account creation Successful. Redirecting to account page");
              // send user to account page
              window.location.replace("/account");
            }
          );
        });
    })