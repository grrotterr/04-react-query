import { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

import css from "./App.module.css";

import SearchBar from "../SearchBar/SearchBar";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";

import { fetchMovies } from "../../services/movieService";

import type { Movie } from "../../types/movie";


type ModuleWithDefault<T> = {
  default: T;
};

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;


export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] =
    useState<Movie | null>(null);


  const {
  data,
  isLoading,
  isError,
} = useQuery({
  queryKey: ["movies", query, page],
  queryFn: () => fetchMovies(query, page),
  enabled: Boolean(query),
  placeholderData: (previousData) => previousData,
});


  const movies = useMemo(
  () => data?.results ?? [],
  [data]
);


  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };


  const handlePageChange = ({
    selected,
  }: {
    selected: number;
  }) => {
    setPage(selected + 1);
  };


  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };


  const handleCloseModal = () => {
    setSelectedMovie(null);
  };


  useEffect(() => {
    if (
      query &&
      !isLoading &&
      movies.length === 0
    ) {
      toast.error(
        "No movies found for your request."
      );
    }
  }, [query, isLoading, movies]);


  return (
    <div className={css.app}>
      <Toaster />

      <SearchBar
        onSubmit={handleSearch}
      />


      {isLoading && <Loader />}


      {isError && <ErrorMessage />}


      {!isLoading &&
        !isError &&
        movies.length > 0 && (
          <>
            <MovieGrid
              movies={movies}
              onSelect={handleSelect}
            />


            {data &&
              data.total_pages > 1 && (
                <ReactPaginate
                  pageCount={data.total_pages}
                  pageRangeDisplayed={5}
                  marginPagesDisplayed={1}
                  onPageChange={handlePageChange}
                  forcePage={page - 1}
                  containerClassName={
                    css.pagination
                  }
                  activeClassName={
                    css.active
                  }
                  nextLabel="→"
                  previousLabel="←"
                />
              )}
          </>
        )}


      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}