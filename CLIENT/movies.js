
const castsApi = "https://proj.ruppin.ac.il/bgroup3/test2/tar1/api/Casts";
const moviesApi = "https://proj.ruppin.ac.il/bgroup3/test2/tar1/api/Movies";
$(document).ready(() => {
  filterButtons();
  $("#showMovies").click(renderMovies);
  $("#showWishlist").click(() => {
    $("#moviesContainer").addClass('d-none');
    $("#castFormContainer").addClass('d-none');
    $("#wishlistContainer").removeClass('d-none');
    ajaxCall("GET", moviesApi, null, scbShowWishList, ecbShowWishList);
});
  $("#showCasts").click(() => {
    $("#moviesContainer").addClass('d-none');
    $("#wishlistContainer").addClass('d-none');
    $("#castFormContainer").removeClass('d-none');
    ajaxCall("GET", castsApi, null, scbCasts, ecb);
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
  $("#castForm").submit(submitCasts);
  $("#dateOfBirth").on("input", () => {
    $("#dateError").hide();
  });
  renderMovies();
});
checkYear = () => {
  const currentYear = new Date().getFullYear();
  const yearOfBirth = new Date($("#dateOfBirth").val()).getFullYear();
  if (yearOfBirth < currentYear - 100 || yearOfBirth > currentYear - 18) {
    $("#dateError").html(`Year of birth must be between ${currentYear - 100} and ${currentYear - 18}.`)
      .show();
    return false;
  }
  return true;
};
submitCasts = (event) => {
  event.preventDefault();
  if (checkYear()) {
    const newCast = {
      id: $("#id").val(),
      name: $("#name").val(),
      role: $("#role").val(),
      dateOfBirth: $("#dateOfBirth").val(),
      country: $("#country").val(),
      photoUrl: $("#photoUrl").val(),
    };
    ajaxCall("POST", castsApi, JSON.stringify(newCast), (data) => {
      scbcastadded(data);
      if (data) {
        addSingleCastToDOM(newCast); 
      }},ecb);
    // ajaxCall("GET", castsApi, null, scbCasts, ecb);
  }
};

scbCasts = (casts) => {
  const castsDetailsDiv = $("#castsDetails");
  castsDetailsDiv.empty()
                 .addClass('casts-grid');
  casts.forEach(addSingleCastToDOM);
};

addSingleCastToDOM = (cast) => {
  const castElement = `
      <div class="cast-card">
          <img src="${cast.photoUrl}" alt="${cast.name}" class="cast-photo">
          <div class="cast-info">
              <h3>${cast.name}</h3>
              <p><strong>Role:</strong> ${cast.role}</p>
              <p><strong>Date of Birth:</strong> ${cast.dateOfBirth}</p>
              <p><strong>Country:</strong> ${cast.country}</p>
          </div>
      </div>`;
  $("#castsDetails").append(castElement);
};
scbcastadded = (data) => {
  Swal.fire({
    title: data ? "The cast has been added!" : "The cast already exists!",
    text: data ? "Form submitted successfully!" : "Add one with a different ID, please!",
    icon: data ? "success" : "error",
  });
};

renderMovies = () => {
  $("#wishlistContainer, #castFormContainer").addClass('d-none');
  $("#moviesContainer").removeClass('d-none');
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
      ${wishlist.map(movie => `
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
      `).join('')}
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
    text: data ? "The movie added to the wish list!" : "Add different one, please!",
    icon: data ? "success" : "error",
  });
}),
  (ecb = () => {
    Swal.fire({
      title: "OH NO!!!!!!!",
      text: "Something went wrong with the server!",
      icon: "error",
    });
  });

addToWishlist = (movieId) => {
  const movieToAdd = movies.find((m) => m.id === movieId);
  ajaxCall("POST", moviesApi, JSON.stringify(movieToAdd), scb, ecb); //sending the movie to server
};

filterButtons = () => {
    $("#rating").on("input", function() {
        $("#filterByRating").prop("disabled", !this.value);
    });
    $("#duration").on("input", function() {
        $("#filterByDuration").prop("disabled", !this.value);
    });
    $("#filterByRating, #filterByDuration").prop("disabled", true);
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
