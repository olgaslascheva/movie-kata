import React, { Component } from 'react';
import { Online, Offline } from 'react-detect-offline';
import { Tabs } from 'antd';
import { debounce } from 'lodash';

import './app.css';
import MovieService from '../../services/movie-service';
import { ContextProvider } from '../../context/context';
import SearchPanel from '../search-panel';
import MoviesList from '../movies-list/movies-list';
import PaginationEl from '../pagination-element';
import ErrorIndicator from '../error-indicator';

export default class App extends Component {
  movieService = new MovieService();

  state = {
    guestSessionId: '',
    movies: [],
    ratedMovies: [],
    inRated: false,
    totalResults: 0,
    allGenres: [],
    searchTerm: '',
    currentPage: 1,
    loading: true,
    error: false,
  };

  componentDidMount() {
    this.movieService.createNewGuestSession().then(this.updateSession).catch(this.catchError);
    this.movieService.getAllGenres().then(this.updateGenres).catch(this.catchError);
    this.movieService.getPopularMovies().then(this.updateState).catch(this.catchError);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { searchTerm, currentPage } = this.state;
    if (prevState.searchTerm !== searchTerm || prevState.currentPage !== currentPage) {
      this.movieService.getSearchedMovies(searchTerm, currentPage).then(this.updateState).catch(this.catchError);
    }
  }

  onSearchChange = debounce((e) => {
    this.setState({
      searchTerm: e.target.value,
    });
  }, 1000);

  updateGenres = (res) => {
    this.setState({
      allGenres: res.genres,
    });
  };

  updateState = (res) => {
    this.setState({
      movies: res.results,
      totalResults: res.total_results,
      loading: false,
    });
  };

  updateSession = (res) => {
    this.setState({
      guestSessionId: res.guest_session_id,
      loading: false,
    });
  };

  catchError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  onTabsChange = () => {
    const { inRated } = this.state;
    this.updateRatedMovies();
    this.setState({ inRated: !inRated });
  };

  updateMovieRating = (movieId, ratingValue) => {
    this.setState(({ movies }) => {
      const idx = movies.findIndex((el) => el.id === movieId);

      const oldItem = movies[idx];
      const newItem = { ...oldItem, rating: ratingValue };

      return {
        movies: [...movies.slice(0, idx), newItem, ...movies.slice(idx + 1)],
      };
    });
  };

  updateRatedMovies = () => {
    const { guestSessionId } = this.state;
    this.movieService
      .getRatedMovies(guestSessionId)
      .then((moviesArray) => {
        this.setState({
          ratedMovies: moviesArray.results,
        });
      })
      .catch(this.catchError);
  };

  onPaginationChange = (page) => {
    this.setState({
      currentPage: page,
    });
  };

  render() {
    const { movies, loading, error, totalResults, currentPage, ratedMovies, inRated, allGenres, guestSessionId } =
      this.state;

    const content = (
      <>
        {!inRated ? <SearchPanel onSearchChange={this.onSearchChange} /> : null}
        <MoviesList
          movies={movies}
          ratedMovies={ratedMovies}
          updateMovieRating={this.updateMovieRating}
          guestSessionId={guestSessionId}
          inRated={inRated}
          totalResults={totalResults}
          loading={loading}
          error={error}
        />
        <PaginationEl
          totalResults={totalResults}
          inRated={inRated}
          currentPage={currentPage}
          onPaginationChange={this.onPaginationChange}
        />
      </>
    );

    return (
      <div className="container">
        <ContextProvider value={allGenres}>
          <Offline>
            <ErrorIndicator description="You're offline right now. Check your connection." />
          </Offline>
          <Online>
            <Tabs
              centered
              defaultActiveKey="1"
              onChange={this.onTabsChange}
              items={[
                {
                  label: 'Search',
                  key: '1',
                  children: content,
                },
                {
                  label: 'Rated',
                  key: '2',
                  children: content,
                },
              ]}
            />
          </Online>
        </ContextProvider>
      </div>
    );
  }
}
