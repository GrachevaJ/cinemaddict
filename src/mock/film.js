import {getRandomInteger, getRandomValue} from '../utils.js';
import {FILM_COUNT} from '../const.js';
import {
  NAME_COUNT, MAX_COMMENTS_ON_FILM, GenreCount, Rating,
  AgeRating, Runtime, YearsDuration, names, surnames,
  titles, posters, genres, description, countries,
} from './const.js';

const getDate = () => {
//создание объекта даты по местному времени
  const date = new Date();
/*
Метод setFullYear() в JavaScript позволяет изменить значение года для объекта даты по местному времени.

Синтаксис: 
дата.setFullYear(год, [месяц], [день]).

Параметры:
yearValue - целое число определяющее значение года, например 1995.

monthValue - необязательный параметр, целое число от 0 до 11, представляющее месяцы от января до декабря.

dayValue - необязательный параметр, целое число от 1 до 31, представляющее день месяца. Если указан параметр dayValue, необходимо также указать параметр monthValue

getFullYear() - метод объекта Date в JavaScript, который влзвращает год указанной даты по местному времени в виде четырехзначного числа.

Синтаксис:
const fullYear = dateObj.getFullYear();
*/

//нижеприведенным действием получаем другой год(текущий минус рандомное число)
  date.setFullYear(
    date.getFullYear() - getRandomInteger(YearsDuration.MIN, YearsDuration.MAX)
  );

  return date.toISOString();
};

const generateFilm = () => ({
  title: getRandomValue(titles),
  alternativeTitle: getRandomValue(titles),
  totalRating: getRandomInteger(Rating.MIN, Rating.MAX),
  poster: getRandomValue(posters),
  ageRating: getRandomInteger(AgeRating.MIN, AgeRating.MAX),
  director: `${getRandomValue(names)} ${getRandomValue(surnames)}`,
  writers: Array.from({length: NAME_COUNT}, () => `${getRandomValue(names)} ${getRandomValue(surnames)}`),
  actors: Array.from({length: NAME_COUNT}, () => `${getRandomValue(names)} ${getRandomValue(surnames)}`),
  release: {
    date: getDate(),
    releaseСountry: getRandomValue(countries)
  },
  runtime: getRandomInteger(Runtime.MIN, Runtime.MAX),
  genre:  Array.from({length: getRandomInteger(GenreCount.MIN, GenreCount.MAX)}, () => getRandomValue(genres)),
  description
});

const generateFilms = () => {
// создаем массив с данными о фильмах
  const films = Array.from({length: FILM_COUNT}, generateFilm);
// ключ totalCommentsCount нужен нам для того, чтобы у фильмов не повторялись id комментариев, ведь не может быть, чтобы один комментарий относился к нескольким фильмам
  let totalCommentsCount = 0;

  return films.map((film, index) => {
    const hasComments = getRandomInteger(0, 1);

    const filmCommentsCount = (hasComments)
      ? getRandomInteger(1, MAX_COMMENTS_ON_FILM)
      : 0;
    //Логика такая: суммируем все id комментариев...
    totalCommentsCount += filmCommentsCount;
// на основе массива создаем массив с объектами нужной нам структуры
    return {
      id: String(index + 1), // просто порядковый номер
      comments: (hasComments)
        ? Array.from({length: filmCommentsCount},
          // ...и раздаём их по порядку с конца
          (_value, commentIndex) => String(totalCommentsCount - commentIndex)
        )
        //если комментарии нужны, генерируем их id; если не нужны, подставляем пустой массив.
        : [],
      filmInfo: film,
    };
  });
};

export {generateFilms};
