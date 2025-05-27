// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomValue = (items) =>
  items[getRandomInteger(0, items.length - 1)];
//Методы принимают toLocaleString()значения Date, содержащие зависимое от языка представление этой даты в местном часовом поясе.
const formatStringToDateWithTime = (date) =>
  new Date(date).toLocaleString('en-GB');
/*
Формат даты и времени может быть настроен с помощью параметра options:

const date = new Date(Date.UTC(2012, 11, 20, 3, 0, 0, 200));

// Запрашиваем день недели вместе с длинным форматом даты
let options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
console.log(new Intl.DateTimeFormat("de-DE", options).format(date));
// "Donnerstag, 20. Dezember 2012"
*/
const formatStringToDate = (date) =>
  new Date(date).toLocaleString('en-GB', {day: '2-digit', month: 'long', year: 'numeric'});

const formatStringToYear = (date) =>
  new Date(date).getFullYear();

const formatMinutesToTime = (minutes) => {
  const MINUTES_PER_HOUR = 60;

  return (minutes < MINUTES_PER_HOUR)
    ? `${minutes}m`
    : `${Math.floor(minutes / MINUTES_PER_HOUR)}h ${minutes % MINUTES_PER_HOUR}m`;
};

export {
  getRandomInteger,
  getRandomValue,
  formatStringToDateWithTime,
  formatStringToDate,
  formatStringToYear,
  formatMinutesToTime
};
