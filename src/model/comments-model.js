import {generateComments} from '../mock/comment.js';

export default class CommentsModel {
  #filmsModel = null;
  #allComments = [];
  #comments = [];

  constructor(filmsModel) {
    this.#filmsModel = filmsModel;
    this.generateAllComments();
  }

  generateAllComments() {
    this.#allComments = generateComments(this.#filmsModel.get());
  }

  //Метод find()экземпляров Arrayвозвращает первый элемент в предоставленном массиве, который удовлетворяет предоставленной функции тестирования. Если ни одно значение не удовлетворяет функции тестирования, undefinedвозвращается.
  get = (film) => {
    this.#comments = film.comments.map((commentId) =>
      this.#allComments.find((comment) =>
        comment.id === commentId)
    );

    return this.#comments;
  };
}
