const userAPI = "https://localhost:7125/api/Users/login";
// פונקציה להצגת הודעות למשתמש

$(document).ready(() => {
  $("#login-btn").click((event) => {
    event.preventDefault();
    const user = {
      Id: 0,
      userName: $("#username").val(),
      email: "",
      password: $("#password").val(),
    };
    ajaxCall(
      "POST",
      userAPI,
      JSON.stringify(user),
      (data) => {
        console.log(data)
        localStorage.setItem("isLoggedIn", "true"); // Or sessionStorage
        localStorage.setItem("userName", user.userName);
        localStorage.setItem("id", data);
        Swal.fire({
          title: "The user has been found!",
          text: "Login successful!",
          icon: "success",
        }).then(() => {
          window.location.href = "movies.html";
        });
      },
      (xhr) => {
        if (xhr.status === 401) {
          Swal.fire({
            title: "Unauthorized",
            text: "Invalid username or password!",
            icon: "error",
          });
        } else if (xhr.status === 400) {
          Swal.fire({
            title: "Bad Request",
            text: "Check the data you entered and try again!",
            icon: "error",
          });
        } else {
          Swal.fire({
            title: "Server Error",
            text: "Something went wrong on the server!",
            icon: "error",
          });
        }
      }
    );

    $("#signupButton").click(() => {
      $("#signupModal").modal("show");
    });
  });
});

function ajaxCall(method, api, data, successCB, errorCB) {
  $.ajax({
    type: method,
    url: api,
    data: data,
    cache: false,
    contentType: "application/json",
    dataType: "json",
    success: successCB,
    error: errorCB,
  });
}
