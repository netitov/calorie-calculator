import '../assets/styles/index.css';
import MealTable from './mealTable';
import Summary from './summary';
import { dateToDM, compareDates, dateToInputValue } from '../assets/utils/dateFormater';

const dateInput = document.querySelector('.page__datepicker-input');
const dateValue = document.querySelector('.page__date-value');

const dateHandler = {
  currentDate: dateToInputValue(new Date()),

  getCurrentDate() {
    return this.currentDate;
  },

  setCurrentDate(newDate) {
    this.currentDate = newDate;
  }
};

const mealTable = new MealTable(() => dateHandler.getCurrentDate(), updateSummary);
const summary = new Summary({
  getCurrentElements: () => mealTable.getCurrentElements(),
  getCurrentDate: () => dateHandler.getCurrentDate(),
});

mealTable.setEventListeners();
summary.setEventListeners();

//update summary when tables data is changed
function updateSummary() {
  summary.fillSummary();
}

//handle date change
dateInput.addEventListener('change', () => {
  const formattedDate = dateToDM(dateInput.value);
  dateHandler.setCurrentDate(dateInput.value);
  let selectedDate;
  if (compareDates(new Date(), dateInput.value)) {
    selectedDate = 'Сегодня';
  } else {
    selectedDate = formattedDate;
  }
  dateValue.textContent = selectedDate;
  mealTable.renderItems();
  summary.fillSummary();
})

