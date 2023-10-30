import { updateLocalStorage } from '../assets/utils/localStorageHandler';

export default class Summary {
  constructor ({ getCurrentElements, getCurrentDate }) {
    this._goalElement = document.querySelector('.page__goal-value');
    this._factElement = document.querySelector('.page__fact-value');
    this._percentElement = document.querySelector('.page__fact-value-percent');
    this._getCurrentElements = getCurrentElements;
    this._getCurrentDate = getCurrentDate;
    this._editBtn = document.querySelector('.page__goal-edit-btn');
    this._goals = JSON.parse(localStorage.getItem('goals')) || [];
    this._goalBox = document.querySelector('.page__goal-box');
    this._factBox = document.querySelector('.page__fact-box');
    this._limitValue = document.querySelector('.page__tooltip-value');
  }

  _updateGoal() {
    const date = this._getCurrentDate();
    const goalObj = { id: date, date, goal: Number(this._goalElement.value) };

    //update summary in local storage
    updateLocalStorage(goalObj, 'goal', 'goals');

    //update summary in class property: this._goals
    const index = this._goals.findIndex(item => item.id === goalObj.id);
    if (index !== -1) {
      this._goals[index].goal = goalObj.goal;
    } else {
      this._goals.push(goalObj);
    }

    //style goal element if goal = 0
    if (this._goalElement.value !== 0) {
      this._goalBox.classList.remove('page__goal-box_inactive');
    } else {
      this._goalBox.classList.add('page__goal-box_inactive');
    }

  }

  fillSummary() {
    const date = this._getCurrentDate();
    const currentTableElements = this._getCurrentElements();
    const currentGoal = this._goals.find(i => i.date === date);
    let totalEnergyValue = 0;

    //get current sum of fact energy
    if (currentTableElements.length > 0) {
      const mealEnergyArr = currentTableElements.map((i) => i.mealEnergy ? i.mealEnergy : 0 );
      const totalMealEnergy = mealEnergyArr.reduce((prev, curr) => prev + curr);
      totalEnergyValue = totalMealEnergy;
    }

    this._factElement.textContent = totalEnergyValue;
    let currentGoalValue;

    if (currentGoal && currentGoal.goal !== 0) {
      //fill goal value if it's exists
      this._goalElement.value = currentGoal.goal;
      currentGoalValue = currentGoal.goal;
      this._goalBox.classList.remove('page__goal-box_inactive');
      this._percentElement.textContent = Math.round(totalEnergyValue / currentGoal.goal * 100) + '%';

    } else if (this._goals.length > 0 && currentGoal?.goal !== 0) {
      //if goal is not filled use avarage value
      const goalsValueArr = this._goals.map(i => i.goal);
      const averageGoalValue = Math.round(goalsValueArr.reduce((prev, curr) => prev + curr) / goalsValueArr.length);
      this._goalElement.value = averageGoalValue;
      currentGoalValue = averageGoalValue;
    } else {
      this._goalBox.classList.add('page__goal-box_inactive');
      this._percentElement.textContent = 0 + '%';
    }

    this._checkLimit(totalEnergyValue, currentGoalValue);
  }

  //display warning if goal value exceeded
  _checkLimit(totalEnergyValue, goal) {
    if (totalEnergyValue > goal) {
      this._factBox.classList.add('page__fact-box_exceeded');
      this._limitValue.textContent = Math.round(totalEnergyValue - goal);
    } else {
      this._factBox.classList.remove('page__fact-box_exceeded');
    }
  }

  setEventListeners() {

    //init summary filling
    this.fillSummary();

    //handle edit btn event
    this._editBtn.addEventListener('click', () => {
      this._goalElement.focus();
      this._goalBox.classList.remove('page__goal-box_inactive');
    });

    //update goal
    this._goalElement.addEventListener('blur', () => {
      this._updateGoal();
      this.fillSummary();
    });

  }

}
