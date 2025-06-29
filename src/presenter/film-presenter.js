import { render, remove, replace } from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmDetailsView from '../view/film-details-view.js';

export default class FilmPresenter {
  #filmListContainer = null;

  #filmComponent = null;
  #filmDetailsComponent = null;

  #film = null;

  constructor(filmListContainer) {
    this.#filmListContainer = filmListContainer;
  }

  init = (film, comments) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevFilmDetailsComponent = this.#filmDetailsComponent;

    this.#filmComponent = new FilmCardView(film);
    this.#filmDetailsComponent = new FilmDetailsView(film, comments);

    this.#filmComponent.setEditClickHandler(this.#handleEditClick);

    this.#filmDetailsComponent.setClickHandler(this.#handleClick);

    if (prevFilmComponent === null || prevFilmDetailsComponent === null) {
      render(this.#filmComponent, this.#filmListContainer);
      return;
    }

    if (this.#filmListContainer.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (this.#filmListContainer.contains(prevFilmDetailsComponent.element)) {
      replace(this.#filmDetailsComponent, prevFilmDetailsComponent);
    }

    remove(prevFilmComponent);
    remove(prevFilmDetailsComponent);
  };

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#filmDetailsComponent);
  };

  #openFilmDetails = () => {
    document.querySelector('body').classList.add('hide-overflow');

    this.#filmListContainer.parentElement.appendChild(this.#filmDetailsComponent.element);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #closeFilmDetails = () => {
    document.querySelector('body').classList.remove('hide-overflow');

    this.#filmListContainer.parentElement.removeChild(this.#filmDetailsComponent.element);

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closeFilmDetails();
    }
  };

  #handleEditClick = () => {
    this.#openFilmDetails();
  };

  #handleClick = () => {
    this.#closeFilmDetails();
  };
}
