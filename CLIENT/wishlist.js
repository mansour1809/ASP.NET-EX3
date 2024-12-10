

$(document).ready(()=>{

    $("#showWishlist").click(renderWishList);
    $("#filterByRating").click(renderWishListByRating);
    $("#filterByDuration").click(renderWishListByDuration);
    filterButtons();


})

renderWishList = () =>{
    $("#moviesContainer").addClass("d-none");
    $("#castFormContainer").addClass("d-none");
    $("#wishlistContainer").removeClass("d-none");
    $("#addMovie").hide();
    ajaxCall("GET", moviesApi, null, scbShowWishList, ecbShowWishList);

}

renderWishListByRating = () =>{
    $("#duration").val("");
    $("#filterByDuration").prop("disabled", true);
    ajaxCall("GET",moviesApi + "/Rating/" + $("#rating").val(),null,scbShowWishList,ecbShowWishList);
}

renderWishListByDuration = () =>{
    $("#rating").val("");
    $("#filterByRating").prop("disabled", true);
    ajaxCall("GET",moviesApi + "/Duration?duration=" + $("#duration").val(),null,scbShowWishList,ecbShowWishLis);
}

  
scbShowWishList = (wishlist) => {
  let wishlistHtml = `
      ${wishlist.map((movie) => `
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
  $("#wishListMovies").html("<p>No Movies to show</p>");
};

///need to modifyyyyyyyyyYYYYYYYYYYYYYYYYYYYYYY  , handle adding to wishList!
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