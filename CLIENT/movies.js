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

  $("#showWishlist").click(() => {
    $("#moviesContainer").addClass("d-none");
    $("#castFormContainer").addClass("d-none");
    $("#wishlistContainer").removeClass("d-none");
    $("#addMovie").hide();
    ajaxCall("GET", moviesApi, null, scbShowWishList, ecbShowWishList);
  });

  $("#filterByRating").click(() => {
    $("#duration").val("");
    $("#filterByDuration").prop("disabled", true);
    ajaxCall(
      "GET",
      moviesApi + "/Rating/" + $("#rating").val(),
      null,
      scbShowWishList,
      ecbShowWishList
    );
  });
  $("#filterByDuration").click(() => {
    $("#rating").val("");
    $("#filterByRating").prop("disabled", true);
    ajaxCall(
      "GET",
      moviesApi + "/Duration?duration=" + $("#duration").val(),
      null,
      scbShowWishList,
      ecbShowWishList
    );
  });

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
scbShowWishList = (wishlist) => {
  let wishlistHtml = `
      ${wishlist
        .map(
          (movie) => `
        <div class="col">
          <div class="card h-100 movie-card">
          <div class="img-container">
          <img src="${movie.photoUrl}" alt="${movie.title}">
        </div>
            <div class="card-body">
              <h5 class="card-title text-primary fw-bold">${movie.title}</h5>
              <p class="card-text text-muted">${movie.description}</p>
            </div>
            <div class="card-footer bg-light">
              <div class="d-flex gap-2 flex-wrap">
                <span class="badge bg-primary">
                  <i class="fas fa-star me-1"></i>Rating: ${movie.rating}
                </span>
                <span class="badge bg-secondary">
                  <i class="fas fa-calendar me-1"></i>${movie.releaseYear}
                </span>
                <span class="badge bg-info">
                  <i class="fas fa-clock me-1"></i>${movie.duration} min
                </span>
              </div>
            </div>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
  $("#wishListMovies").html(wishlistHtml);
};
ecbShowWishList = () => {
  $("#wishListMovies").html("<p>Error loading wishlist</p>");
};

(scb = (data) => {
  Swal.fire({
    title: data ? "Added!" : "The movie already exists!",
    text: data
      ? "The movie added to the wish list!"
      : "Add different one, please!",
    icon: data ? "success" : "error",
  });
}),
  (addToWishlist = (movieId) => {
    const movieToAdd = movies.find((m) => m.id === movieId);
    ajaxCall("POST", moviesApi, JSON.stringify(movieToAdd), scb, ecb); //sending the movie to server
  });

filterButtons = () => {
  $("#rating").on("input", function () {
    $("#filterByRating").prop("disabled", !this.value);
  });
  $("#duration").on("input", function () {
    $("#filterByDuration").prop("disabled", !this.value);
  });
  $("#filterByRating, #filterByDuration").prop("disabled", true);
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
