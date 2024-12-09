
const castsApi = "https://localhost:7125/api/Casts";
const moviesApi = "https://localhost:7125/api/Movies";
$(document).ready(() => {
  $('#movieForm').on('submit', addMovie)

  $('#addMovie').click(() => {
    $('#addMovieModal').modal('show');
  });  filterButtons();
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



// //
// async function fetchMovies() {
//   try {
//       const response = await fetch('/api/movies'); // Replace with your API endpoint
//       if (!response.ok) throw new Error('Failed to fetch movies');
//       const movies = await response.json();
//       renderMovies(movies);
//   } catch (error) {
//       console.error(error);
//       alert("Error fetching movies from the database.");
//   }
// }


// function renderMovies(movies) {
//   const movieContainer = document.getElementById('movies-container');
//   movieContainer.innerHTML = ''; 

//   movies.forEach(movie => {
//       const movieCard = `
//           <div class="movie-card">
//               <img src="${movie.photoUrl}" alt="${movie.title}" class="movie-image" />
//               <h3>${movie.title}</h3>
//               <p>${movie.description}</p>
//               <p><strong>Rating:</strong> ${movie.rating}</p>
//               <p><strong>Income:</strong> $${movie.income.toLocaleString()}</p>
//               <p><strong>Release Year:</strong> ${movie.releaseYear}</p>
//               <p><strong>Duration:</strong> ${movie.duration} min</p>
//               <p><strong>Language:</strong> ${movie.language}</p>
//               <p><strong>Genre:</strong> ${movie.genre}</p>
//               <button onclick="addToWishlist(${movie.id})">Add to Wishlist</button>
//           </div>
//       `;
//       movieContainer.innerHTML += movieCard;
//   });
// }


// document.getElementById('add-movie-form').addEventListener('submit', async function (e) {
//   e.preventDefault();
//   const formData = new FormData(e.target);
//   const newMovie = Object.fromEntries(formData.entries());
//   newMovie.rating = parseFloat(newMovie.rating);
//   newMovie.income = parseInt(newMovie.income, 10);
//   newMovie.releaseYear = parseInt(newMovie.releaseYear, 10);
//   newMovie.duration = parseInt(newMovie.duration, 10);

//   try {
//       const response = await fetch('/api/movies', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(newMovie),
//       });

//       if (!response.ok) throw new Error('Failed to add movie');
//       alert('Movie added successfully!');
//       fetchMovies(); 
//   } catch (error) {
//       console.error(error);
//       alert('Error adding movie to the database.');
//   }
// });

// fetchMovies();

addMovie = (e)=>{
  e.preventDefault(); // Prevent the default form submission behavior

  // Serialize the form data
 // const formData = $(this).serialize();

  // AJAX call to send data to the server
//   ajaxCall("POST", castsApi, JSON.stringify(newCast), (data) => {
//     scbcastadded(data);
//     if (data) {
//       addSingleCastToDOM(newCast); 
//     }},ecb);
//   // ajaxCall("GET", castsApi, null, scbCasts, ecb);
// }
  ajaxCall("POST", moviesApi, JSON.stringify(newCast),(response)=>{
    if (response.success) {
      Swal.fire({
        icon: 'success',
        title: 'Movie Added!',
        text: 'The movie was added successfully.',
      });
      $('#addMovieModal').modal('hide'); // Hide the modal
      $('#movieForm')[0].reset(); // Reset the form
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.message || 'Failed to add the movie.',
      });
    }
  },()=>{
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while adding the movie.',
    });
  }
)};


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
