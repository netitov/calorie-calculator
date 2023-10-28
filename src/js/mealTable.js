import { generateId } from '../assets/utils/idGenerator';
import { updateLocalStorage, removeFromLocalStorage } from '../assets/utils/localStorageHandler';

export default class MealTable {
  constructor () {
    this._tableBody = document.querySelector('.table__body');
    this._addBtn = document.querySelector('.page__btn-add');
    this._deleteAllBtn = document.querySelector('.page__delete-btn');
  }

   _generateItem(savedMeal) {
    const elementTemplate = document.querySelector('#table-row').content.cloneNode(true);
    this._allInputs = elementTemplate.querySelectorAll('.table__input');
    this._mealInputTemplate = elementTemplate.querySelector('.table__input-meal');
    this._mealTimeElement = elementTemplate.querySelector('.table__meal-type');
    this._mealSizeElement = elementTemplate.querySelector('.table__meal-size');
    this._mealEnergyElement = elementTemplate.querySelector('.table__meal-energy');
    this._rowTemplate = elementTemplate.querySelector('.table__row');
    this._deleteBtn = elementTemplate.querySelector('.table__delete-btn');

    const rowElement = elementTemplate.querySelector('.table__row');

    let id;

    if (savedMeal) {
      this._mealInputTemplate.value = savedMeal.meal || 'Что-то вкусное';
      this._mealTimeElement.value = savedMeal.mealTime || 'Завтрак';
      this._mealSizeElement.value = savedMeal.mealSize || '';
      this._mealEnergyElement.value = savedMeal.mealEnergy || '';
      id = savedMeal.id;
    } else {
      id = generateId();
    }

    rowElement.setAttribute('data-id', id);

    //add change listener
    this._allInputs.forEach((i) => {
      i.addEventListener('blur', () => {
        this._handleInputChange(id, i, rowElement);
      })
    })

    //add 'Select' listener
    this._mealTimeElement.addEventListener('change', (e) => {
      this._handleInputChange(id, this._mealTimeElement, rowElement, e.target.value)
    });

    //add delete btn listener
    this._deleteBtn.addEventListener('click', () => this._deleteItem(id, rowElement));

    return elementTemplate;
   }

   _addItem(generatedItem) {
    this._playlistBody.append(generatedItem);
   }

   _renderItems() {
    const savedElements = JSON.parse(localStorage.getItem('meals'));
    if (savedElements) {
      savedElements.forEach((i) => {
        const generatedItem = this._generateItem(i);
        this._tableBody.append(generatedItem);
        this._rowTemplate.classList.remove('table__row_template');
      })
    }
  }

  _handleInputChange(id, input, rowElement, selectValue) {
    //save changes only if input is not empty
    let newValue = selectValue || input.value;
    if (newValue) {
      const newMeal = { id, [input.name]: newValue };
      updateLocalStorage(newMeal, input.name, 'meals');

      //remove new meal styles
      rowElement.classList.remove('table__row_template');
    }
  }

  _deleteItem(id, element) {
    removeFromLocalStorage(id, 'meals');
    element.remove();
  }

  setEventListeners() {

    //add meal on btn click
    this._addBtn.addEventListener('click', () => {
      const elementTemplate = this._generateItem();
      this._tableBody.append(elementTemplate);
      this._mealInputTemplate.focus();
    })

    //initial items render
    this._renderItems();

    //clear meal table on btn click
    this._deleteAllBtn.addEventListener('click', () => {
      const allTableRows = this._tableBody.querySelectorAll('.table__row');
      allTableRows.forEach((i) => {
        this._deleteItem(i.dataset.id, i);
      })
    })


  }

}
