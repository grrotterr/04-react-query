import axios from "axios";

import type { Movie } from "../types/movie";


interface MoviesResponse {
  results: Movie[];
  total_pages: number;
}


const BASE_URL =
  "https://api.themoviedb.org/3";


const token = import.meta.env.VITE_TMDB_TOKEN;


export async function fetchMovies(
  query: string,
  page: number
): Promise<MoviesResponse> {
  const response =
    await axios.get<MoviesResponse>(
      `${BASE_URL}/search/movie`,
      {
        params: {
          query,
          page,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data;
}