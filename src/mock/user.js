const UserStatusTitle = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie buff'
};

const UserStatusValue = {
  NOVICE: 0,
  FAN: 10,
  MOVIE_BUFF: 20
};

const getUserStatus = (films) => {
  const watchedFilmCount = films.filter((film) => film.userDetails.alreadyWatched).length;

  if (watchedFilmCount > UserStatusValue.NOVICE && watchedFilmCount <= UserStatusValue.FAN) {
    return UserStatusTitle.NOVICE;
  }

  if (watchedFilmCount > UserStatusValue.FAN && watchedFilmCount <= UserStatusValue.MOVIE_BUFF) {
    return UserStatusTitle.FAN;
  }

  if (watchedFilmCount > UserStatusValue.MOVIE_BUFF) {
    return UserStatusTitle.MOVIE_BUFF;
  }

  return null;
};

export {getUserStatus}
