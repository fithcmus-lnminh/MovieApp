import React, { useState, useEffect, useCallback } from "react";
import classes from "./App.module.css";
import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [error, setError] = useState(null);

  //use useCallback to use the external state
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://react-http-b2a24-default-rtdb.firebaseio.com/movies.json"
      ); //default method is GET
      if (!response.ok) {
        throw new Error("Oops! Something went wrong!");
      }

      const data = await response.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler(); //if function don't use use callback, effect don't know which is changed in function
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    try {
      setIsLoadingPost(true);
      setError(null);
      const response = await fetch(
        "https://react-http-b2a24-default-rtdb.firebaseio.com/movies.json",
        {
          method: "POST",
          body: JSON.stringify(movie),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();
      console.log(data);
    } catch (err) {
      setError(err);
    }
    setIsLoadingPost(false);
  }

  let content = <h3>Found no movies</h3>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <h3>{error}</h3>;
  }

  if (isLoading) {
    content = (
      <div>
        <div className={classes.loader}></div>
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} isLoading={isLoadingPost} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
