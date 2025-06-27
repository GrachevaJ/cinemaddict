import { render } from '../framework/render.js';
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

  init = (film) => {
    this.#film = film;

    this.#filmComponent = new FilmCardView(film);
    this.#filmDetailsComponent = new FilmDetailsView(film);

    this.#filmComponent.setEditClickHandler(this.#handleEditClick);

    this.#filmDetailsComponent.setClickHandler(this.#handleClick);

    render(this.#filmComponent, this.#filmListContainer);
  };

  #openFilmDetails = () => {
    document.querySelector('body').classList.add('hide-overflow');

    this.#filmListContainer.parentElement.appendChild(this.#filmDetailsComponent);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #closeFilmDetails = () => {
    document.querySelector('body').classList.remove('hide-overflow');

    this.#filmListContainer.parentElement.removeChild(this.#filmDetailsComponent);

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
