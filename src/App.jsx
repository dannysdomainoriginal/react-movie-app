import React, { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import useTrendingStore from "./store/trending-store";
import { useFetchMovies } from "./hooks";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");

  useDebounce(() => setDebounceSearchTerm(searchTerm), 750, [searchTerm]);

  // trending movies using zustand and localStorage persistence
  const trendingMovies = useTrendingStore((state) => state.trendingMovies);
  const [errMessage, movies, isLoading] = useFetchMovies(debounceSearchTerm);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {[...trendingMovies]
                .sort((a, b) => b.count - a.count) // sort before rendering
                .slice(0, 5)
                .map((movie, i) => (
                  <li key={movie.id}>
                    <p>{i + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
            </ul>
          </section>
        )}

        <div className="all-movies">
          <h2 className={trendingMovies.length ? "" : "mt-10"}>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errMessage ? (
            <p className="text-red-500">{errMessage}</p>
          ) : movies.length ? (
            <ul>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          ) : (
            <p className="text-white">
              We couldn't find the movie you're searching for
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default App;
