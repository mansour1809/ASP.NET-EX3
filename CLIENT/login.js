       // פונקציה להצגת הודעות למשתמש

$(document).ready(()=>{
    $('#signupButton').click(() => {
        $('#signupModal').modal('show');
       });
});
      

       function showMessage(message, isError = false) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.style.color = isError ? 'red' : 'green';
}

// קריאה ל-Login
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // קבלת פרטי הטופס
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // קריאת Fetch לשרת
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message);
                });
            }
            return response.json();
        })
        .then(data => {
            showMessage(`Welcome, ${data.username}!`);
        })
        .catch(error => {
            showMessage(error.message, true);
        });
});

// קריאה ל-Sign Up
document.getElementById('signupButton').addEventListener('click', function () {
    // תוכל להוסיף פעולה נוספת אם צריך, לדוגמה לעבור לדף רישום אחר
    window.location.href = '/signup';  // לדוגמה, למעבר לדף רישום
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
  