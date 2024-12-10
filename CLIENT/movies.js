const moviesApi = "https://localhost:7125/api/Movies";

$(document).ready(() => {
  if (localStorage.getItem("isLoggedIn") === "true") {
    $("#welcomeMessage").text(`Welcome, ${localStorage.getItem("userName")}!`);
    $("#signOutButton").show(); // Show sign-out button
  } else {
    window.location.href = "login.html";
  }

  $("#signOutButton").click(() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    window.location.href = "login.html";
  });

  $("#movieForm").on("submit", addMovie);

  $("#addMovie").click(() => {
    $("#addMovieModal").modal("show");
  });

  filterButtons();

  $("#showMovies").click(renderMovies);

  

  

  renderMovies();
});


renderMovies = () => {
  $("#castFormContainer").addClass("d-none");
  $("#wishlistContainer").addClass("d-none");
  $("#moviesContainer").removeClass("d-none");
  $("#addMovie").show();
  let moviesHtml = "";
  movies.forEach((movie) => {
    moviesHtml += `
          <div class="col-lg-3 col-md-4 col-sm-6">
              <div class="card h-100">
                  <img loading="lazy" src="${movie.photoUrl}" class="card-img-top" alt="${movie.title}  loading="lazy"">
                  <div class="card-body">
                      <h5 class="card-title">${movie.title}</h5>
                      <p class="card-text">${movie.description}</p>
                  </div>
                  <div class="card-footer">
                      <div class="mb-2">
                          <span class="badge bg-primary">Rating: ${movie.rating}</span>
                          <span class="badge bg-secondary">Year: ${movie.releaseYear}</span>
                          <span class="badge bg-info">Duration: ${movie.duration} min</span>
                      </div>
                      <button class="btn btn-primary w-100" onclick="addToWishlist(${movie.id})">Add to Wishlist</button>
                  </div>
              </div>
          </div>
      `;
  });
  $("#moviesContainer").html(moviesHtml);
};


addMovie = (e) => {
  e.preventDefault(); // Prevent the default form submission behavior

  ajaxCall(
    "POST",
    moviesApi,
    JSON.stringify(),
    (response) => {
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Movie Added!",
          text: "The movie was added successfully.",
        });
        $("#addMovieModal").modal("hide"); // Hide the modal
        $("#movieForm")[0].reset(); // Reset the form
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message || "Failed to add the movie.",
        });
      }
    },
    () => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while adding the movie.",
      });
    }
  );
};

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
