import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import FilmButtonMoreView from '../view/film-button-more-view.js';
import FilmCardView from '../view/film-card-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import NoFilmView from '../view/no-film-view.js';

import { render } from '../framework/render.js';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #container = null;
  #filmsModel = null;
  #commentsModel = null;

  #films = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  #sortComponent = new SortView();
  #filmsComponent = new FilmsView();
  #filmListComponent = new FilmListView();
  #filmListContainerComponent = new FilmListContainerView();
  #filmButtonMoreComponent = new FilmButtonMoreView();

  init = (container, filmsModel, commentsModel) => {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#films = [...this.#filmsModel.films];

    if (this.#films.length === 0) {
      render(new NoFilmView(), this.#container);
    }
    else {  render(this.#sortComponent, this.#container);
      render(this.#filmsComponent, this.#container);
      render(this.#filmListComponent, this.#filmsComponent.element);
      render(this.#filmListContainerComponent, this.#filmListComponent.element);

      // for (let i = 0; i < this.#films.length; i++) {
      //   render(new FilmCardView(this.#films[i]), this.#filmListContainerComponent.element);
      // }
      for(let i = 0; i < Math.min(this.#films.length, FILM_COUNT_PER_STEP); i++) {
        this.#renderFilm(this.#films[i]);
      }

      if (this.#films.length > FILM_COUNT_PER_STEP) {
        render(this.#filmButtonMoreComponent, this.#filmListComponent.element);
        this.#filmButtonMoreComponent.element.addEventListener('click', this.#handleLoadMoreButtonClick);
      }}
    // const comments = [...this.#commentsModel.get(this.#films[0])];

    // render(new FilmDetailsView(this.#films[0], comments), this.#container.parentElement);
  };

  #handleLoadMoreButtonClick = () => {
    this.#films
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP) // слайсим от индекса 4(тех что уже отрисованы) до индекса 9 (при уувеличении счетчика это будет 9 и 14 и тд)
      .forEach((film) => this.#renderFilm(film));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP; // увеличиваем счетчик

    if (this.#renderedFilmCount >= this.#films.length) {
      this.#filmButtonMoreComponent.element.remove();
      this.#filmButtonMoreComponent.removeElement();
    }
  };

  #renderFilm = (film) => {
    const filmComponent = new FilmCardView(film);
    const comments = this.#commentsModel.get(film);
    const filmDetailsComponent = new FilmDetailsView(film, comments);

    const openFilmDetails = () => {
      document.querySelector('body').classList.add('hide-overflow');
      this.#container.parentElement.appendChild(filmDetailsComponent.element);
    };

    const closeFilmDetails = () => {
      document.querySelector('body').classList.remove('hide-overflow');
      this.#container.parentElement.removeChild(filmDetailsComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if(evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closeFilmDetails();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    filmComponent.setEditClickHandler(() => {
      openFilmDetails();
      document.addEventListener('keydown', onEscKeyDown);
    });

    filmDetailsComponent.setClickHandler(() => {
      closeFilmDetails();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(filmComponent, this.#filmListContainerComponent.element);
  };
}
