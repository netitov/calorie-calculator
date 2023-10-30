

export function dateToDM(date) {

  const inputDateValue = new Date(date);

  const day = inputDateValue.getDate();
  const month = inputDateValue.getMonth();

  const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const formattedDate = day + ' ' + monthNames[month];

  return formattedDate;
}

export function dateToInputValue(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

export function dateToDDMM(date) {
  const dateForm = new Date(date);
  const month = (dateForm.getMonth() + 1).toString().padStart(2, '0');
  const day = dateForm.getDate().toString().padStart(2, '0');

  const formattedDate = `${day}.${month}`;

  return formattedDate;
}

export function compareDates(date1, date2) {
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);

  return firstDate.toDateString() === secondDate.toDateString();
}
