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
        localStorage.setItem("isLoggedIn", "true"); // Or sessionStorage
        localStorage.setItem("userName", user.userName);
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

//        function showMessage(message, isError = false) {
//     const messageDiv = document.getElementById('message');
//     messageDiv.textContent = message;
//     messageDiv.style.color = isError ? 'red' : 'green';
// }

// // קריאה ל-Login
// document.getElementById('loginForm').addEventListener('submit', function (e) {
//     e.preventDefault();

//     // קבלת פרטי הטופס
//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;

//     // קריאת Fetch לשרת
//     fetch('/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password }),
//     })
//         .then(response => {
//             if (!response.ok) {
//                 return response.json().then(data => {
//                     throw new Error(data.message);
//                 });
//             }
//             return response.json();
//         })
//         .then(data => {
//             showMessage(`Welcome, ${data.username}!`);
//         })
//         .catch(error => {
//             showMessage(error.message, true);
//         });
// });

// // קריאה ל-Sign Up
// document.getElementById('signupButton').addEventListener('click', function () {
//     // תוכל להוסיף פעולה נוספת אם צריך, לדוגמה לעבור לדף רישום אחר
//     window.location.href = '/signup';  // לדוגמה, למעבר לדף רישום
// });

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
