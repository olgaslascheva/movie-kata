export default class MovieService {
  _apiBase = 'https://api.themoviedb.org/3/';

  _apiKey = '933f73dfbf70413bba3393e1e7bd1dd1';

  async getResource(url) {
    const res = await fetch(`${this._apiBase}${url}`);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return res.json();
  }

  createNewGuestSession() {
    return this.getResource(`/authentication/guest_session/new?api_key=${this._apiKey}`);
  }

  getPopularMovies() {
    return this.getResource(`movie/popular?api_key=${this._apiKey}`);
  }

  getSearchedMovies(searchValue, page = 1) {
    return this.getResource(`search/movie?api_key=${this._apiKey}&query=${searchValue}&page=${page}`);
  }

  async rateMovie(value, movieId, guestSessionId) {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${this._apiKey}&guest_session_id=${guestSessionId}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          value,
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`Could not fetch url: ${res.status}`);
    }
    return res.json();
  }

  getRatedMovies(guestSessionId) {
    return this.getResource(
      `guest_session/${guestSessionId}/rated/movies?api_key=${this._apiKey}&sort_by=created_at.asc`
    );
  }

  getAllGenres() {
    return this.getResource(`genre/movie/list?api_key=${this._apiKey}`);
  }
}

//   async getGenresNames(array) {
//     const res = await this.getResource(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this._apiKey}`);
//
//     let genresNames = [];
//
//     array.forEach( (id) => {
//       res.genres.forEach( (obj) => {
//         if (obj.id === id) {
//           genresNames.push(obj.name);
//         }
//       });
//     })
//
//     return genresNames;
//   };
