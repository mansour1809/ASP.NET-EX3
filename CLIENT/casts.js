const castsApi = "https://localhost:7125/api/Casts";

$(document).ready(()=>{

    $("#showCasts").click(() => {
        $("#moviesContainer").addClass('d-none');
        $("#wishlistContainer").addClass('d-none');
        $("#castFormContainer").removeClass('d-none');
        $("#addMovie").hide();
        ajaxCall("GET", castsApi, null, 
            
            (casts)=>{
            $("#castsDetails").empty().addClass('casts-grid');
            console.log(casts)
            casts.forEach(addSingleCastToDOMo)}
            , ecb);
    });

    $("#castForm").submit(submitCasts);
    $("#dateOfBirth").on("input", () => {
      $("#dateError").hide();
    });    
})


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
        Swal.fire({
            title: data ? "The cast has been added!" : "The cast already exists!",
            text: data ? "Form submitted successfully!" : "Add one with a different ID, please!",
            icon: data ? "success" : "error",
          });
          (addSingleCastToDOM(newCast))
        },ecb());
    }
  };


  addSingleCastToDOMo = (cast) => {
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


  ecb = () => {
    Swal.fire({
      title: "OH NO!!!!!!!",
      text: "Something went wrong with the server!",
      icon: "error",
    });
  };