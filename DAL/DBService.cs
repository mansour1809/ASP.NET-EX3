﻿using HW1.BL;
using System.Data;
using System.Data.SqlClient;

namespace HW1.DAL
{
    public class DBService
    {
        public DBService()
        {

        }
        public SqlConnection connect(String conString)
        {

            // read the connection string from the configuration file
            IConfigurationRoot configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json").Build();
            string cStr = configuration.GetConnectionString(conString);
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }

        private SqlCommand CreateCommandWithStoredProcedureGeneral(String spName, SqlConnection con, Dictionary<string, object> paramDic)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            if (paramDic != null)
                foreach (KeyValuePair<string, object> param in paramDic)
                {
                    cmd.Parameters.AddWithValue(param.Key, param.Value);

                }


            return cmd;
        }

        //public bool UpdateWishList(int id)// 
        //{
        //    SqlConnection con;
        //    SqlCommand cmd;
        //    try
        //    {
        //        con = connect("myProjDB"); // create the connection
        //    }
        //    catch (Exception ex)
        //    {
        //        // write to log
        //        throw (ex);
        //    }
        //    Dictionary<string, object> paramDic = new Dictionary<string, object>();
        //     paramDic.Add("@Id", id);

        //    cmd = CreateCommandWithStoredProcedureGeneral("sp_UpdateWishList", con, paramDic); // create the command

        //    try
        //    {
        //        cmd.ExecuteNonQuery();
        //        return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw (ex);
        //    }
        //    finally
        //    {
        //        if (con != null)
        //        {
        //            // close the db connection
        //            con.Close();
        //        }
        //    }
        //}

        public bool InsertMovie(Movie m)// 
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            // paramDic.Add("@id", m.Id);
            paramDic.Add("@Title", m.Title);
            paramDic.Add("@Rating", m.Rating);
            paramDic.Add("@Income", m.Income);
            paramDic.Add("@ReleaseYear", m.ReleaseYear);
            paramDic.Add("@Duration", m.Duration);
            paramDic.Add("@Language", m.Language);
            paramDic.Add("@Description", m.Description);
            paramDic.Add("@Genre", m.Genre);
            paramDic.Add("@PhotoUrl", m.PhotoUrl);


            cmd = CreateCommandWithStoredProcedureGeneral("sp_InsertMovies", con, paramDic); // create the command

            try
            {
                cmd.ExecuteNonQuery();
                return true;
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }

        public List<Movie> ReadMovies(string sp)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            cmd = CreateCommandWithStoredProcedureGeneral(sp, con, null); // create the command

            try
            {

                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                List<Movie> movies = new List<Movie>();

                while (dataReader.Read())
                {
                    Movie m = new Movie();
                    m.Id = Convert.ToInt32(dataReader["Id"].ToString());
                    m.Title = dataReader["Title"].ToString();
                    m.Rating = Convert.ToDouble(dataReader["Rating"].ToString());
                    m.Income = Convert.ToInt32(dataReader["Income"].ToString());
                    m.ReleaseYear = Convert.ToInt32(dataReader["ReleaseYear"]);
                    m.Duration = Convert.ToInt32(dataReader["Duration"]);
                    m.Language = dataReader["Language"].ToString();
                    m.Description = dataReader["Description"].ToString();
                    m.Genre = dataReader["Genre"].ToString();
                    m.PhotoUrl = dataReader["PhotoUrl"].ToString();
                    movies.Add(m);
                }
                return movies;

            }
            catch (Exception ex)
            {
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }

        }


        public List<Movie> ReadWishlist(string sp, int userId)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            Dictionary<string, object> paramDic = new Dictionary<string, object> {
                        { "@UserId", userId }
                    };

            cmd = CreateCommandWithStoredProcedureGeneral(sp, con, paramDic); // create the command

            try
            {

                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                List<Movie> wishlist = new List<Movie>();

                while (dataReader.Read())
                {
                    Movie m = new Movie();
                    m.Id = Convert.ToInt32(dataReader["Id"].ToString());
                    m.Title = dataReader["Title"].ToString();
                    m.Rating = Convert.ToDouble(dataReader["Rating"].ToString());
                    m.Income = Convert.ToInt32(dataReader["Income"].ToString());
                    m.ReleaseYear = Convert.ToInt32(dataReader["ReleaseYear"]);
                    m.Duration = Convert.ToInt32(dataReader["Duration"]);
                    m.Language = dataReader["Language"].ToString();
                    m.Description = dataReader["Description"].ToString();
                    m.Genre = dataReader["Genre"].ToString();
                    m.PhotoUrl = dataReader["PhotoUrl"].ToString();
                    wishlist.Add(m);
                }
                return wishlist;

            }
            catch (Exception ex)
            {
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }

        }

        public List<Movie> ReadByRating(int userId, double rating)
        {
            List<Movie> movies = new List<Movie>();
            SqlConnection con = null; // Declare outside the try block

            try
            {
                con = connect("myProjDB"); // Assign connection here
                Dictionary<string, object> paramDic = new Dictionary<string, object> {
            { "@Rating", rating },
            { "@UserId", userId }
        };

                using (SqlCommand cmd = CreateCommandWithStoredProcedureGeneral("sp_filterByRate", con, paramDic))
                {
                    using (SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection))
                    {
                        while (dataReader.Read())
                        {
                            Movie m = new Movie
                            {
                                Id = dataReader.GetInt32(dataReader.GetOrdinal("Id")),
                                Title = dataReader["Title"].ToString(),
                                Rating = dataReader.GetDouble(dataReader.GetOrdinal("Rating")),
                                Income = dataReader.GetInt32(dataReader.GetOrdinal("Income")),
                                ReleaseYear = dataReader.GetInt32(dataReader.GetOrdinal("ReleaseYear")),
                                Duration = dataReader.GetInt32(dataReader.GetOrdinal("Duration")),
                                Language = dataReader["Language"].ToString(),
                                Description = dataReader["Description"].ToString(),
                                Genre = dataReader["Genre"].ToString(),
                                PhotoUrl = dataReader["PhotoUrl"].ToString()
                            };
                            movies.Add(m);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while fetching movies by rating.", ex);
            }
            finally
            {
                if (con != null && con.State != ConnectionState.Closed)
                {
                    con.Close(); // Close the connection in finally
                }
            }
            return movies;
        }


        public List<Movie> ReadByDuration(int userId, int duration)
        {
            List<Movie> movies = new List<Movie>();
            SqlConnection con = null; // Declare outside the try block

            try
            {
                con = connect("myProjDB"); // Initialize connection
                Dictionary<string, object> paramDic = new Dictionary<string, object> {
            { "@Duration", duration },
            { "@UserId", userId }
        };

                using (SqlCommand cmd = CreateCommandWithStoredProcedureGeneral("sp_filterByDuration", con, paramDic))
                {
                    using (SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection))
                    {
                        while (dataReader.Read())
                        {
                            Movie m = new Movie
                            {
                                Id = dataReader.GetInt32(dataReader.GetOrdinal("Id")),
                                Title = dataReader["Title"].ToString(),
                                Rating = dataReader.GetDouble(dataReader.GetOrdinal("Rating")),
                                Income = dataReader.GetInt32(dataReader.GetOrdinal("Income")),
                                ReleaseYear = dataReader.GetInt32(dataReader.GetOrdinal("ReleaseYear")),
                                Duration = dataReader.GetInt32(dataReader.GetOrdinal("Duration")),
                                Language = dataReader["Language"].ToString(),
                                Description = dataReader["Description"].ToString(),
                                Genre = dataReader["Genre"].ToString(),
                                PhotoUrl = dataReader["PhotoUrl"].ToString()
                            };
                            movies.Add(m);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while fetching movies by duration.", ex);
            }
            finally
            {
                if (con != null && con.State != ConnectionState.Closed)
                {
                    con.Close(); // Close the connection in finally
                }
            }
            return movies;
        }



        public bool InsertCast(Cast c)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
           // paramDic.Add("@Id", c.Id);
            paramDic.Add("@Name", c.Name);
            paramDic.Add("@Role", c.Role);
            paramDic.Add("@DateOfBirth", c.DateOfBirth);
            paramDic.Add("@country", c.Country);
            paramDic.Add("@PhotoUrl", c.PhotoUrl);

            cmd = CreateCommandWithStoredProcedureGeneral("sp_InsertCast", con, paramDic); // create the command

            try
            {
                cmd.ExecuteNonQuery();
                return true;
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }

        public List<Cast> ReadCasts()
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }


            cmd = CreateCommandWithStoredProcedureGeneral("sp_ReturnCast", con, null); // create the command

            try
            {

                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                List<Cast> casts = new List<Cast>();
                while (dataReader.Read())
                {
                    Cast c = new Cast();
                    c.Id = (dataReader["Id"]).ToString();
                    c.Name = dataReader["Name"].ToString();
                    c.Role = dataReader["Role"].ToString();
                    c.DateOfBirth = Convert.ToDateTime(dataReader["DateOfBirth"]);
                    c.Country = dataReader["country"].ToString();
                    c.PhotoUrl = dataReader["PhotoUrl"].ToString();
                    casts.Add(c);
                }
                return casts;

            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }

        }


        public bool InsertUser(User u)// 
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            // paramDic.Add("@id", u.Id);
            paramDic.Add("@UserName", u.UserName);
            paramDic.Add("@Email", u.Email);
            paramDic.Add("@Password", u.Password);


            cmd = CreateCommandWithStoredProcedureGeneral("sp_InsertUser", con, paramDic); // create the command

            try
            {
                cmd.ExecuteNonQuery();
                return true;
            }
            catch (SqlException ex)
            {
                if (ex.Number == 50001) // Custom error code for "Username already exists"
                {
                    return false;
                }
                // write to log
                throw (ex);

            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }

        public int ReadUser(string userName, string password)
        {
            //if (userName == null || password == null)
            //    return false;
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@UserName", userName);
            paramDic.Add("@Password", password);

            cmd = CreateCommandWithStoredProcedureGeneral("sp_ReadUser", con, paramDic); // create the command

            try
            {
                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                return dataReader.Read() ? Convert.ToInt32(dataReader["ID"].ToString()) : -1;

            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }

        }


        public bool InsertToWishList(int userId, int movieId)// 
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            // paramDic.Add("@id", u.Id);
            paramDic.Add("@UserId", userId);
            paramDic.Add("@MovieId", movieId);


            cmd = CreateCommandWithStoredProcedureGeneral("sp_AddToWishList", con, paramDic); // create the command

            try
            {
                cmd.ExecuteNonQuery();
                return true;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);

            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }


    }
}















