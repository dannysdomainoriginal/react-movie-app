import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useTrendingStore = create(
  persist(
    (set) => ({
      trendingMovies: [],
      updateSearchCount: (query, movie) =>
        set((state) => {
          console.log("updating count....")
          const exists = state.trendingMovies.find(
            (t) => t.searchTerm === query
          );

          if (exists) {
            return {
              trendingMovies: state.trendingMovies.map((t) =>
                t.searchTerm === query ? { ...t, count: t.count + 1 } : t
              ),
            };
          }

          return {
            trendingMovies: [
              ...state.trendingMovies,
              {
                searchTerm: query,
                count: 1,
                id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
              },
            ],
          };
        }),
    }),
    {
      name: "ushhje-movies-app:trending-movies-list",
      partialize: (state) => ({ trendingMovies: state.trendingMovies }),
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);

export default useTrendingStore;
