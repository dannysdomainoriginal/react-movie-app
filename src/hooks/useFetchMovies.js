import { useState, useEffect } from "react";
import tmdb from "../api/tmdb";
import useTrendingStore from "../store/trending-store";

const useFetchMovies = (debounceSearchTerm) => {
  const [errMessage, setErrMessage] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateSearchCount = useTrendingStore(
    (state) => state.updateSearchCount
  );

  useEffect(() => {
    setIsLoading(true);
    setErrMessage("");

    const fetchMovies = async (query = "") => {
      try {
        const res = query
          ? await tmdb.get("/search/movie", {
              params: {
                query: encodeURIComponent(query),
              },
            })
          : await tmdb.get("/discover/movie", {
              params: {
                sort: "popularity.desc",
                include_adult: false,
              },
            });

        console.log(res);
        setMovies(res.data?.results || []);

        if (query && res.data?.results?.length > 0) {
          updateSearchCount(query, res.data?.results[0]);
        }
      } catch (err) {
        setMovies([]);
        console.error("Error fetching movies: ", err);
        setErrMessage("Error fetching movies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  return [errMessage, movies, isLoading];
};

export default useFetchMovies;
