module.exports = (obj, ...fieldsToKeep) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (fieldsToKeep.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
