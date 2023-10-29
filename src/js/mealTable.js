import { generateId } from '../assets/utils/idGenerator';
import { updateLocalStorage, removeFromLocalStorage } from '../assets/utils/localStorageHandler';
import { compareByField } from '../assets/utils/sorter';

export default class MealTable {
  constructor () {
    this._tableBody = document.querySelector('.table__body');
    this._addBtn = document.querySelector('.page__btn-add');
    this._deleteAllBtn = document.querySelector('.page__delete-btn');
    this._sortedField;
    this._savedElements = JSON.parse(localStorage.getItem('meals'));
    this._headers = document.querySelectorAll('.table__header');
    this._mealData;
  }

  _generateItem(savedMeal) {
    const elementTemplate = document.querySelector('#table-row').content.cloneNode(true);
    const allInputs = elementTemplate.querySelectorAll('.table__input');
    this._rowTemplate = elementTemplate.querySelector('.table__row');
    const deleteBtn = elementTemplate.querySelector('.table__delete-btn');
    const rowElement = elementTemplate.querySelector('.table__row');
    const mealInput = elementTemplate.querySelector('.table__input-meal');
    const mealTime = elementTemplate.querySelector('.table__meal-type');
    let id;
    //if meal already saved in local storage - fill table
    if (savedMeal) {
      this._fillTable(savedMeal, rowElement);
      id = savedMeal.id;
    } else {
      id = generateId();
    }
    rowElement.setAttribute('data-id', id);
    //add change listener
    allInputs.forEach((i) => {
      i.addEventListener('blur', () => {
        this._handleInputChange(id, i, rowElement);
      })
    })
    //add 'Select' listener
    mealTime.addEventListener('change', (e) => {
      this._handleInputChange(id, mealTime, rowElement, e.target.value);
    });
    //add delete btn listener
    deleteBtn.addEventListener('click', () => this._deleteItem(id, rowElement));
    return { elementTemplate, mealInput };
  }

  _fillTable(savedMeal, tableRow) {
    const mealInputElement = tableRow.querySelector('.table__input-meal');
    const mealTimeElement = tableRow.querySelector('.table__meal-type');
    const mealSizeElement = tableRow.querySelector('.table__meal-size');
    const mealEnergyElement = tableRow.querySelector('.table__meal-energy');

    mealInputElement.value = savedMeal.meal || 'Что-то вкусное';
    mealTimeElement.value = savedMeal.mealTime || 'Завтрак';
    mealSizeElement.value = savedMeal.mealSize || '';
    mealEnergyElement.value = savedMeal.mealEnergy || '';
  }

  _renderItems(elements) {
    if (elements) {
      elements.forEach((i) => {
        const { elementTemplate } = this._generateItem(i);
        this._tableBody.append(elementTemplate);
        this._rowTemplate.classList.remove('table__row_template');
      })
    }
  }

  _handleInputChange(id, input, rowElement, selectValue) {
    //save changes only if input is not empty
    let newValue = selectValue || input.value;
    if (newValue) {
      const formattedValue = input.type === 'number' ? Number(newValue) : newValue;
      const newMeal = { id, [input.name]: formattedValue };
      updateLocalStorage(newMeal, input.name, 'meals');
      //remove new meal styles
      rowElement.classList.remove('table__row_template');
    }
  }

  _deleteItem(id, element) {
    removeFromLocalStorage(id, 'meals');
    element.remove();
  }

  _sortTable(field) {
    this._savedElements = JSON.parse(localStorage.getItem('meals'));
    let sortedColumn = this._sortedField;
    if (!sortedColumn || !sortedColumn[field]) {
      sortedColumn = { [field]: 'asc' };
    } else {
      sortedColumn = sortedColumn[field] === 'asc' ?  { [field]: 'desc' } :  { [field]: 'asc' };
    }
    const sortedArr = [...this._savedElements].sort(compareByField(field, sortedColumn[field]));
    const rowElements = document.querySelectorAll('.table__row');
    sortedArr.forEach((i, index) => {
      if (rowElements[index]) {
        this._fillTable(i, rowElements[index]);
      }
    })
    //set sorted field for styling table header
    this._sortedField = sortedColumn;
  }

  setEventListeners() {

    //add meal on btn click
    this._addBtn.addEventListener('click', () => {
      const { elementTemplate, mealInput } = this._generateItem();
      this._tableBody.append(elementTemplate);
      mealInput.focus();
    })

    //initial items render
    this._renderItems(this._savedElements);

    //clear meal table on btn click
    this._deleteAllBtn.addEventListener('click', () => {
      const allTableRows = this._tableBody.querySelectorAll('.table__row');
      allTableRows.forEach((i) => {
        this._deleteItem(i.dataset.id, i);
      })
    })

    //handle sorting event
    this._headers.forEach((i) => {
      i.addEventListener('click', () => {
        this._sortTable(i.dataset.name);
        //remove sorting class from all headers
        this._headers.forEach(h => h.classList.remove('table__header_asc', 'table__header_desc'));
        //set style to current header
        i.classList.add(`table__header_${this._sortedField[i.dataset.name]}`);
      })
    })


  }

}
