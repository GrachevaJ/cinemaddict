const FILM_COUNT = 35;

const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

const FILTER_TYPE_ALL_NAME = 'All movies';

const FilterType = {
  ALL: 'all',
  HISTORY: 'alreadyWatched',
  FAVORITES: 'favorite',
  WATCHLIST: 'watchlist'
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating'
};

export {
  FILM_COUNT,
  EMOTIONS,
  FilterType,
  FILTER_TYPE_ALL_NAME,
  SortType
};
