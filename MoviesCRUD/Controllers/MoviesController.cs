using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MoviesCRUD.Models;

namespace MoviesCRUD.Controllers
{
    public class MoviesController : Controller
    {
        private static List<Movie> Movies = new List<Movie>()
        {
            new Movie { Id = 1, Title = "The Shawshank Redemption", Genre = "Drama", Rating = "R" },
            new Movie { Id = 2, Title = "The Godfather", Genre = "Drama", Rating = "R" },
            new Movie { Id = 3, Title = "The Godfather: Part II", Genre = "Drama", Rating = "R" },
            new Movie { Id = 4, Title = "The Dark Knight", Genre = "Drama", Rating = "R" },
        };


        // GET: MoviesController
        public ActionResult Index()
        {
            return View(Movies);
        }

        // GET: MoviesController/Details/5
        public ActionResult Details(int id)
        {
            var Movie = Movies.FirstOrDefault(item => item.Id == id);
            
            if (!Movies.Contains(Movie))
            {
                return NotFound();
            }

            return View(Movie);
        }

        // GET: MoviesController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: MoviesController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                Movie newMovie = new Movie
                {
                    Id = Movies.Count > 0 ? (Movies.Last().Id + 1) : 1,
                    Title = collection["Title"],
                    Genre = collection["Genre"],
                    Rating = collection["Rating"]
                };
                Movies.Add(newMovie);

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }

        }

        // GET: MoviesController/Edit/5
        public ActionResult Edit(int id)
        {
            var Movie = Movies.FirstOrDefault(item => item.Id == id);

            if (!Movies.Contains(Movie))
            {
                return NotFound();
            }

            return View(Movie);
        }

        // POST: MoviesController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                var oldMovie = Movies.FirstOrDefault(item => item.Id == id);
                Movie newMovie = new Movie
                {
                    Id = id,
                    Title = collection["Title"],
                    Genre = collection["Genre"],
                    Rating = collection["Rating"]
                };
                
                oldMovie.Title = newMovie.Title;
                oldMovie.Genre = newMovie.Genre;
                oldMovie.Rating = newMovie.Rating;
                
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: MoviesController/Delete/5
        public ActionResult Delete(int id)
        {
            var Movie = Movies.FirstOrDefault(item => item.Id == id);

            if (!Movies.Contains(Movie))
            {
                return NotFound();
            }

            return View(Movie);
        }

        // POST: MoviesController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                var Movie = Movies.FirstOrDefault(item => item.Id == id);
                Movies.Remove(Movie);
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
