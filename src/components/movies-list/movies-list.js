import React from 'react';

import Movie from '../movie';
import Spinner from '../spinner';
import ErrorIndicator from '../error-indicator';
import './movies-list.css';

function MoviesList({
  movies,
  loading,
  error,
  totalResults,
  guestSessionId,
  ratedMovies,
  inRated,
  updateMovieRating,
  allGenres,
}) {
  const hasData = !(loading || error);

  return (
    <ul className="movie-list">
      {error ? <ErrorIndicator description="Something went wrong." /> : null}
      {loading ? <Spinner /> : null}
      {hasData && !inRated ? (
        <MoviesListView
          movies={movies}
          guestSessionId={guestSessionId}
          updateMovieRating={updateMovieRating}
          allGenres={allGenres}
        />
      ) : null}
      {inRated ? <MoviesListView movies={ratedMovies} guestSessionId={guestSessionId} allGenres={allGenres} /> : null}
      {!loading && !totalResults ? <ErrorIndicator description="Matching movies were not found." /> : null}
    </ul>
  );
}

function MoviesListView({ movies, guestSessionId, updateMovieRating }) {
  return (
    <>
      {movies.map((movie) => {
        return (
          <Movie
            key={movie.id}
            movieData={movie}
            guestSessionId={guestSessionId}
            updateMovieRating={updateMovieRating}
          />
        );
      })}
    </>
  );
}

export default MoviesList;
