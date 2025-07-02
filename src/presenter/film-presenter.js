import { render, remove, replace } from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';

export default class FilmPresenter {
  #filmListContainer = null;

  #changeData = null;
  #clickCardHandler = null;
  #escKeyDownHandler = null;

  #filmComponent = null;


  #film = null;

  constructor(filmListContainer, changeData, clickCardHander, escKeyDownHandler) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#clickCardHandler = clickCardHander;
    this.#escKeyDownHandler = escKeyDownHandler;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;

    this.#filmComponent = new FilmCardView(this.#film);

    this.#filmComponent.setCardClickHandler(() => {
      this.#clickCardHandler(this.#film);
      document.addEventListener('keydown', this.#escKeyDownHandler);
    });

    this.#filmComponent.setWatchlistBtnClickHandler(this.#watchlistBtnClickHandler);
    this.#filmComponent.setWatchedBtnClickHandler(this.#watchedBtnClickHandler);
    this.#filmComponent.setFavoriteBtnClickHandler(this.#favoriteBtnClickHandler);


    if (prevFilmComponent === null) {
      render(this.#filmComponent, this.#filmListContainer.element);
      return;
    }

    replace(this.#filmComponent, prevFilmComponent);

    remove(prevFilmComponent);
  };

  destroy = () => {
    remove(this.#filmComponent);
  };

  #watchlistBtnClickHandler = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        watchlist: !this.#film.userDetails.watchlist
      },
    });
  };

  #watchedBtnClickHandler = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        alreadyWatched: !this.#film.userDetails.alreadyWatched
      }
    });
  };

  #favoriteBtnClickHandler = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        favorite: !this.#film.userDetails.favorite
      }
    });
  };
}
