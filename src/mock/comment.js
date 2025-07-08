import {getRandomInteger, getRandomValue} from '../utils/utils.js';
import {
  DaysDuration,
  names,
  surnames,
  emotions,
  comment,
} from './const.js';

const getDate = () => {
  const date = new Date();

  date.setDate(
    date.getDate() - getRandomInteger(DaysDuration.MIN, DaysDuration.MAX)
  );

  return date.toISOString();
};

const generateComment = () => ({
  author: `${getRandomValue(names)} ${getRandomValue(surnames)}`,
  comment,
  date: getDate(),
  emotion: getRandomValue(emotions),
});
//Обратите внимание на getCommentCount() — функцию подсчета, сколько нужно комментариев. Можно, конечно, нагенерировать комментариев впрок, но зачем? Проще посчитать, сколько сгенерировалось id для комментариев при генерации данных фильмов, и потом создать ровно столько же комментариев.

//Метод reduce() экземпляров Array выполняет пользовательскую функцию обратного вызова "редуктора" для каждого элемента массива по порядку, передавая возвращаемое значение из вычисления для предыдущего элемента. Конечный результат запуска редуктора по всем элементам массива — одно значение.
const getCommentCount = (films) => films.reduce(
  (count, film) => count + film.comments.length, 0
);

const generateComments = (films) => {
  const commentCount = getCommentCount(films);

  return Array.from({length: commentCount}, (_value, index) => {
    const commentItem = generateComment();

    return {
      id: String(index + 1),
      ...commentItem,
    };
  });
};

export {generateComments};
