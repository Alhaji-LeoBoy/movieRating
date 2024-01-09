import { useEffect, useState } from "react";
import "./index.css";
import {
  NavBar,
  NumResult,
  Search,
  Loader,
  ErrorMessage,
  Main,
} from "./Header";
import Box from "./Box";
import { MovieList } from "./MovieList";
import { MovieDetails } from "./MovieDetails";
import { WatechedMovieList, WatechedSummary } from "./Watech";

const KEY = "af34009f";

function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    async function FeatchMovie() {
      try {
        setIsloading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok)
          throw new Error("Something Went Wrong With Featching Movies");
        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie Not Found");
        setMovies(data.Search);
        //selectedId("");
      } catch (err) {
        if (err !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsloading(false);
      }
    }
    if (query.length < 4) {
      setMovies([]);
      setError("");
      return;
    }
    FeatchMovie();

    return function () {
      controller.abort();
    };
  }, [query]);

  const handleWatch = (movie) => {
    setWatched((watched) => [...watched, movie]);
  };
  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleDeleteWateched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movie={movies}></MovieList>} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              onSelectMovie={handleSelectMovie}
            ></MovieList>
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatch={handleWatch}
              handleCloseMovie={handleCloseMovie}
              watched={watched}
              Loader={Loader}
              ErrorMessage={ErrorMessage}
            />
          ) : (
            <>
              <WatechedSummary watched={watched} />
              <WatechedMovieList
                watched={watched}
                onDeleteMovie={handleDeleteWateched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

export default App;
