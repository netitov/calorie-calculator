export function updateLocalStorage(object, changedKey, storageItem) {
  const savedElements = JSON.parse(localStorage.getItem(storageItem)) || [];
  const index = savedElements.findIndex(item => item.id === object.id);

  if (index !== -1) {
    savedElements[index][changedKey] = object[changedKey];
  } else {
    const newObj = !object.mealTime ? { ...object, mealTime: 'Завтрак' } : object;
    savedElements.push(newObj);
  }
  localStorage.setItem(storageItem, JSON.stringify(savedElements));

  return savedElements;
}

export function removeFromLocalStorage(id, storageItem) {
  const savedElements = JSON.parse(localStorage.getItem(storageItem)) || [];
  const updatedElements = savedElements.filter((item) => item.id !== id);
  localStorage.setItem(storageItem, JSON.stringify(updatedElements));

  return updatedElements;
}
