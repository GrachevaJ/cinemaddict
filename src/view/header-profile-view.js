import AbstractView from '../framework/view/abstract-view.js';
import { getUserStatus } from '../mock/user.js';

const createHeaderProfileTemplate = (films) =>
  `
    <section class="header__profile profile">
      <p class="profile__rating">${getUserStatus(films)}</p>
      <img
        class="profile__avatar"
        src="images/bitmap@2x.png"
        alt="Avatar"
        width="35"
        height="35"
      >
    </section>
  `;

export default class HeaderProfileView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createHeaderProfileTemplate(this.#films);
  }
}
