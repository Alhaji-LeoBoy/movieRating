import { useEffect, useState } from "react";
import StarRating from "../StarRating/StarRating.jsx";
const KEY = "af34009f";
const MovieDetails = ({
  selectedId,
  onCloseMovie,
  onAddWatch,
  handleCloseMovie,
  watched,
  Loader,
  ErrorMessage,
}) => {
  // let kEy = "c2151313";
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchUserArray = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useEffect(() => {
    async function GetMovieDetail() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );

        if (!res.ok)
          throw new Error("Something Went Wrong With Featching Movies");
        const data = await res.json();
        // if (data.Response === "False") throw new Error("Movie Not Found");
        setMovie(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
      }
    }
    GetMovieDetail();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return function () {
      document.title = "Movie Application";
    };
  }, [title]);

  useEffect(() => {
    const callback = (event) => {
      if (event.code === "Escape") {
        onCloseMovie();
        console.log("Closed");
      }
    };
    document.addEventListener("keydown", callback);
    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, [onCloseMovie]);

  function handleAdd() {
    const newWatechedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onAddWatch(newWatechedMovie);
    handleCloseMovie();
  }
  return (
    <div className="details">
      {isLoading && <Loader />}
      {!isLoading && !error && (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              ✕
            </button>
            <img src={poster} alt={`Poster of ${movie}`} className="img" />
            <div className="details-overview">
              <h1>{title}</h1>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>💫</span> {imdbRating} Imdb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={28}
                    flexDir="center"
                    defaultRating={5}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      Add to List
                    </button>
                  )}
                </>
              ) : (
                <>
                  <p>
                    You Rated this movie {watchUserArray} <span>⭐️</span>
                  </p>
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export { MovieDetails };
