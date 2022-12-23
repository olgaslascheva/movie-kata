import React, { Component } from 'react';
import { Tag, Typography, Rate } from 'antd';
import { format } from 'date-fns';

import MovieService from '../../services/movie-service';
import { ContextConsumer } from '../../context/context';

import './movie.css';

const { Paragraph } = Typography;

export default class Movie extends Component {
  state = {
    ellipsis: true,
  };

  movieService = new MovieService();

  onRateChange(value) {
    const { guestSessionId, updateMovieRating, movieData } = this.props;
    const { id } = movieData;
    updateMovieRating(id, value);
    this.movieService.rateMovie(value, id, guestSessionId);
  }

  static setRateColor(value) {
    if (value >= 0 && value <= 3) {
      return '#E90000';
    }
    if (value > 3 && value <= 5) {
      return '#E97E00';
    }
    if (value > 5 && value <= 7) {
      return '#E9D100';
    }
    return '#66E900';
  }

  render() {
    const { ellipsis } = this.state;
    const { movieData } = this.props;

    const {
      poster_path: poster,
      title,
      release_date: releaseDate,
      overview,
      vote_average: voteAverage,
      rating,
      genre_ids: movieGenres,
    } = movieData;

    const rateColor = Movie.setRateColor(voteAverage);

    return (
      <li className="movie-list__item">
        <img className="movie-list__image" src={`https://image.tmdb.org/t/p/original${poster}`} alt="" />
        <div className="movie-list__description">
          <div className="movie-list__header">
            <Typography.Title
              level={5}
              style={{
                maxWidth: 200,
                margin: 0,
                marginBottom: 7,
              }}
            >
              {title}
            </Typography.Title>
            <div className="movie-list__rating" style={{ border: `solid 2px ${rateColor}` }}>
              {voteAverage}
            </div>
          </div>
          <Paragraph type="secondary" className="movie-list__date">
            {format(new Date(releaseDate), 'MMMM d, y')}
          </Paragraph>
          <ContextConsumer>
            {(allGenres) => {
              return (
                <div className="movies-ist__tags">
                  {movieGenres.map((genre) => (
                    <Tag key={genre} className="movie-list__tag">
                      {allGenres.find((obj) => obj.id === genre).name}
                    </Tag>
                  ))}
                </div>
              );
            }}
          </ContextConsumer>
          <Paragraph ellipsis={ellipsis ? { rows: 5 } : false}>{overview}</Paragraph>
          <Rate
            value={rating}
            onChange={(value) => this.onRateChange(value)}
            count={10}
            style={{ fontSize: 16, width: 240, position: 'absolute', bottom: 10 }}
          />
        </div>
      </li>
    );
  }
}
