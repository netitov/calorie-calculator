export function compareByField(field, order) {
  return function(a, b) {
    const aValue = a[field];
    const bValue = b[field];

    //if filed is not date
    if (aValue < bValue) {
      return order === 'asc' ? -1 : 1;
    } else if (aValue > bValue) {
      return order === 'asc' ? 1 : -1;
    }

    return 0;
  };
}
