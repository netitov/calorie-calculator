import '../assets/styles/index.css';
import MealTable from './mealTable';
import Summary from './summary';
import Chart from './chart';
import { dateToDM, compareDates, dateToInputValue, dateToDDMM } from '../assets/utils/dateFormater';

const dateInput = document.querySelector('.page__datepicker-input');
const dateValue = document.querySelector('.page__date-value');
const navLink = document.querySelector('.navigation__link');
const chartsElement = document.querySelector('.page__charts');

const dateHandler = {
  currentDate: dateToInputValue(new Date()),

  getCurrentDate() {
    return this.currentDate;
  },

  setCurrentDate(newDate) {
    this.currentDate = newDate;
  }
};

const mealTable = new MealTable(() => dateHandler.getCurrentDate(), updateSummary, renderCharts);
const summary = new Summary({
  getCurrentElements: () => mealTable.getCurrentElements(),
  getCurrentDate: () => dateHandler.getCurrentDate(),
}, renderCharts);
const amountChart = new Chart('.page__chart-amount');
const percentChart = new Chart('.page__chart-percent');

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

//get date for amount chart: last 7 days
function getAmountChartData(meals) {
  const currentDate = new Date();

  //get last date
  currentDate.setDate(currentDate.getDate() - 6);

  const result = [];

  for (let i = 0; i < 7; i++) {
    const targetDate = new Date(currentDate);
    targetDate.setDate(targetDate.getDate() + i);

    const formattedDate = dateToDDMM(targetDate);

    //filter meals by date
    const filteredMeals = meals?.filter(item => {
      return compareDates(targetDate, item.date);
    });


    //get sum of mealEnergy
    const totalMealEnergy = filteredMeals?.reduce((acc, item) => acc + (item.mealEnergy || 0), 0) || 0;
    result.push({ date: formattedDate, value: totalMealEnergy });
  }

  return result;
}

//get date for percent chart: last 7 days
function getPercentChartData(data) {
  const goals = JSON.parse(localStorage.getItem('goals'));
  let averageGoalValue = 0;

  //get avarage goal value
  if (goals?.length > 0) {
    const goalsValueArr = goals.map(i => i.goal);
    averageGoalValue = Math.round(goalsValueArr.reduce((prev, curr) => prev + curr) / goalsValueArr.length);
  }

  const newArr = [];

  data.forEach((i) => {
    //filter goals by date
    const filteredGoal = goals?.find(item => {

      return dateToDDMM(item.date) === i.date;
    });
    const goal = filteredGoal ? filteredGoal.goal : averageGoalValue;
    const percent = Math.round(i.value / goal * 100);

    const newObj = {...i, value: percent }
    newArr.push(newObj);
  })

  return newArr;
}

function renderCharts() {
  //render charts if btn 'chart' active and if there are saved data
  const meals = JSON.parse(localStorage.getItem('meals'));
  if (navLink.classList.contains('navigation__link_active')) {
    const data = getAmountChartData(meals);
    const percentData = getPercentChartData(data);

    amountChart.renderChart(data);
    percentChart.renderChart(percentData);
  }
}


//show/hide charts on btn click
navLink.addEventListener('click', () => {

  if (navLink.classList.contains('navigation__link_active')) {
    chartsElement.classList.remove('page__charts_active');
    navLink.classList.remove('navigation__link_active');
  } else {
    chartsElement.classList.add('page__charts_active');
    navLink.classList.add('navigation__link_active')

    renderCharts();

    //scroll to charts
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
})


