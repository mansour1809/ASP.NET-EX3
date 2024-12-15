using HW1.BL;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HW1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        // GET: api/<MoviesController>
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                List<Movie> movies = Movie.ReadMovie(); // Call the static method from the BL
                return (movies == null || !movies.Any()) ? NotFound("No movies found.") : Ok(movies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("Wishlist/userId/{id}")]
        public IActionResult GetWishlistMovies(int id)
        {
            try
            {
                List<Movie> movies = Movie.ReadWishList(id); // Call the static method from the BL
                return Ok(movies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("Wishlist/userId/{id}/Rating/{rating}")]
        public IActionResult GetByRating(int id, double rating)
        {
            try
            {
                List<Movie> movies = Movie.ReadByRating(id,rating);
                return (movies == null || !movies.Any()) ? NotFound($"No movies found with a rating >= {rating} ") : Ok(movies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("Wishlist/userId/{id}/Duration")]
        public IActionResult GetByDuration(int id , int duration)
        {
            try
            {
                List<Movie> movies = Movie.ReadByDuration(id, duration);
                return (movies == null || !movies.Any()) ? NotFound($"No movies found with a duration <= {duration} minutes") : Ok(movies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        //Delete from the wishlist

        //[HttpDelete("removeFromWishlist/{id}")]
        //public IActionResult RemoveFromWishlist(int id)
        //{
        //    if (movie == null) return NotFound();
        //    movie.IsWishlist = false;
        //    return Ok(movie);
        //}


        // POST api/<MoviesController>
        [HttpPost]
        public bool Post([FromBody] Movie m)
        {
            try
            {
                return m.InsertMovie();
            }
            catch (Exception)
            {
                return false;
            }
        }
        [HttpPost("WishList/userId/{userId}/movieId/{movieId}")]
        public IActionResult Post(int userId, int movieId)
        {
            try
            {
                bool isInserted = Movie.InsertToWishList(userId, movieId);
                return isInserted
                    ? Ok(new { Message = "Movie added to wishlist successfully." })
                    : StatusCode(StatusCodes.Status500InternalServerError, "Failed to update wishlist status.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred: {ex.Message}");
            }
        }

    }
}
