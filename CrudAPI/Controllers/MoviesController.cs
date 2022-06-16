using CrudAPI.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CrudAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private static List<Movie> Movies = new List<Movie>()
        {
            new Movie { Id = 1, Title = "The Shawshank Redemption", Genre = "Drama", Rating = "R" },
            new Movie { Id = 2, Title = "The Godfather", Genre = "Drama", Rating = "R" },
            new Movie { Id = 3, Title = "The Godfather: Part II", Genre = "Drama", Rating = "R" },
            new Movie { Id = 4, Title = "The Dark Knight", Genre = "Drama", Rating = "R" },
        };

        // GET: api/<MoviesController>
        [HttpGet]
        public ActionResult<IEnumerable<Movie>> Get()
        {
            return Movies;
        }

        // GET api/<MoviesController>/5
        [HttpGet("{id}")]
        public ActionResult<Movie> Get(int id)
        {
            var Movie = Movies.FirstOrDefault(item => item.Id == id);

            if (!Movies.Contains(Movie))
            {
                return NotFound("Fail!");
            }

            return Movie;
        }

        // POST api/<MoviesController>
        [HttpPost]
        public string Post([FromBody] Movie movie)
        {
            Movies.Add(movie);
            return "Success!";
        }

        // PUT api/<MoviesController>/5
        [HttpPut("{id}")]
        public string Put(int id, [FromBody] Movie movie)
        {
            Movie oldMovie = Movies.FirstOrDefault(item => item.Id == id);

            if (!Movies.Contains(oldMovie))
            {
                return "Fail!";
            }

            oldMovie.Id = movie.Id;
            oldMovie.Title = movie.Title;
            oldMovie.Genre = movie.Genre;
            oldMovie.Rating = movie.Rating;
            return "Success!";
        }

        // DELETE api/<MoviesController>/5
        [HttpDelete("{id}")]
        public string Delete(int id)
        {
            Movie movie = Movies.FirstOrDefault(item => item.Id == id);

            if (!Movies.Contains(movie))
            {
                return "Fail!";
            }

            Movies.Remove(movie);
            return "Success!";
        }
    }
}

