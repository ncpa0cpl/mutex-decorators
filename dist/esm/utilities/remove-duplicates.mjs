// src/utilities/remove-duplicates.ts
var removeDuplicates = (array) => {
  return array.filter((value, index) => array.indexOf(value) === index);
};
export {
  removeDuplicates
};
