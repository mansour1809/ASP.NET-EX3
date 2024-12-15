using HW1.DAL;

namespace HW1.BL
{
    public class Movie
    {
        int id;
        string title;
        double rating;
        int income;
        int releaseYear;
        int duration;
        string language;
        string description;
        string genre;
        string photoUrl;
       // bool isWishList;

        public int Id { get => id; set => id = value; }
        public string Title { get => title; set => title = value; }
        public double Rating { get => rating; set => rating = value; }
        public int Income { get => income; set => income = value; }
        public int ReleaseYear { get => releaseYear; set => releaseYear = value; }
        public int Duration { get => duration; set => duration = value; }
        public string Language { get => language; set => language = value; }
        public string Description { get => description; set => description = value; }
        public string Genre { get => genre; set => genre = value; }
        public string PhotoUrl { get => photoUrl; set => photoUrl = value; }
       // public bool IsWishList { get => isWishList; set => isWishList = value; }

        public Movie() { }

         public bool InsertMovie()
        {
            try
            {
                List<Movie> movies = new List<Movie>();
                DBService dB = new DBService();
                movies = dB.ReadMovies("sp_ReturnMovies");
                foreach (Movie movie in movies)
                {
                    if (movie.Title == this.Title)
                        return false;
                }
                dB.InsertMovie(this);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        static public bool InsertToWishList(int userId , int movieId)
        {
            DBService dB = new DBService();
            return dB.InsertToWishList(userId,movieId);
        }

        static public List<Movie> ReadWishList(int userId)
        {
            DBService dB = new DBService();
            return dB.ReadWishlist("sp_ReturnWishListMovies" , userId);
        }

        static public List<Movie> ReadMovie()
        {
            DBService dB = new DBService();
            return dB.ReadMovies("sp_ReturnMovies");
        }

        public static List<Movie> ReadByRating(int userId, double rating)
        {
            DBService dB = new DBService();
            return dB.ReadByRating(userId, rating);
        }


        public static List<Movie> ReadByDuration(int userId, int duration)
        {
            DBService dB = new DBService();
            return dB.ReadByDuration(userId,duration);
        }


    }

}

