import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import FilmButtonMoreView from '../view/film-button-more-view.js';
import NoFilmView from '../view/no-film-view.js';
import FilmPresenter from './film-presenter.js';
import FilmDetailsPresenter from './film-details-presenter.js';

import {render, replace} from '../framework/render.js';
import {sortFilmsByDate, sortFilmsByRating, updateItem} from '../utils/utils.js';
import { SortType } from '../utils/const.js';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #container = null;
  #filmsModel = null;
  #commentsModel = null;
  #sortComponent = null;

  #films = [];
  #sourcedFilms = [];
  #currentSortType = SortType.DEFAULT;

  #selectedFilm = null;

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #filmDetailsPresenter = null;

  #filmsComponent = new FilmsView();
  #filmListComponent = new FilmListView();
  #filmListContainerComponent = new FilmListContainerView();
  #filmButtonMoreComponent = new FilmButtonMoreView();
  #noFilmComponent = new NoFilmView();

  constructor(container, filmsModel, commentsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  init = () => {
    this.#films = [...this.#filmsModel.get()];
    this.#sourcedFilms = [...this.#filmsModel.get()];
    this.#renderFilms();
  };

  #renderNofilms = () => {
    render(this.#noFilmComponent, this.#container);
  };

  #handleFilmChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);

    if (this.#filmDetailsPresenter && this.#selectedFilm.id === updatedFilm.id) {
      this.#renderFilmDetails();
    }

    this.#selectedFilm = updatedFilm;
  };

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#films.sort(sortFilmsByDate);
        break;
      case SortType.RATING:
        this.#films.sort(sortFilmsByRating);
        break;
      default:
        this.#films = [...this.#sourcedFilms];
    }

    this.#currentSortType = sortType;
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearFilmList();
    this.#renderSort();
    this.#renderFilmList();
  };

  #renderSort = () => {
    if (!this.#sortComponent) {
      this.#sortComponent = new SortView(this.#currentSortType);
      render(this.#sortComponent, this.#container);
    } else {
      const updatedSortrComponent = new SortView(this.#currentSortType);
      replace(updatedSortrComponent, this.#sortComponent);
      this.#sortComponent = updatedSortrComponent;
    }

    this.#sortComponent.setSortTypeChangeHandler(this.#sortTypeChangeHandler);
  };

  #renderFilmMoreButton = () => {
    render(this.#filmButtonMoreComponent, this.#filmListComponent.element);

    this.#filmButtonMoreComponent.setClickHandler(() => this.#handleLoadMoreButtonClick());
  };

  #renderFilmSlice = (from, to) => {
    this.#films.slice(from, to).forEach((film) => this.#renderFilm(film));
  };

  #renderFilmListContainer = () => {
    render(this.#filmsComponent, this.#container);
    render(this.#filmListComponent, this.#filmsComponent.element);
    render(this.#filmListContainerComponent, this.#filmListComponent.element);
  };

  #renderFilmList() {
    this.#renderFilmSlice(0,  Math.min(this.#films.length, FILM_COUNT_PER_STEP));

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      this.#renderFilmMoreButton();
    }
  }

  #renderFilms = () => {
    if (this.#films.length === 0) {
      this.#renderNofilms();
      return;
    }

    this.#renderSort();
    this.#renderFilmListContainer();
    this.#renderFilmList();
  };

  #handleLoadMoreButtonClick = () => {
    this.#renderFilmSlice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);

    this.#renderedFilmCount += FILM_COUNT_PER_STEP; // увеличиваем счетчик

    if (this.#renderedFilmCount >= this.#films.length) {
      this.#filmButtonMoreComponent.element.remove();
      this.#filmButtonMoreComponent.removeElement();
    }
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmListContainerComponent, this.#handleFilmChange, this.#addFilmDetailsComponent, this.#onEscKeyDown);

    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderFilmDetails() {
    const comments = [...this.#commentsModel.get(this.#selectedFilm)];

    if (!this.#filmDetailsPresenter) {
      this.#filmDetailsPresenter = new FilmDetailsPresenter(
        this.#container.parentNode,
        this.#handleFilmChange,
        this.#removeFilmDetailsComponent,
        this.#onEscKeyDown
      );
    }

    this.#filmDetailsPresenter.init(this.#selectedFilm, comments);
  }

  #addFilmDetailsComponent = (film) => {
    if (this.#selectedFilm && this.#selectedFilm.id === film.id) {
      return;
    }

    if (this.#selectedFilm && this.#selectedFilm.id !== film.id) {
      this.#removeFilmDetailsComponent();
    }

    this.#selectedFilm = film;
    this.#renderFilmDetails();

    document.body.classList.add('hide-overflow');
  };

  #removeFilmDetailsComponent = () => {
    this.#filmDetailsPresenter.destroy();
    this.#filmDetailsPresenter = null;
    this.#selectedFilm = null;

    document.body.classList.remove('hide-overflow');
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removeFilmDetailsComponent();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
  };
}
