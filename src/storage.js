const storage = window.localStorage;

const setItem = (key, value) => {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (e) {
    alert(e.message);
  }
};

const getItem = (key, defaultValue) => {
  try {
    const returnValue = JSON.parse(storage.getItem(key));
    return returnValue ? returnValue : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const clearItem = (key) => {
  storage.removeItem(key);
};

export { setItem, getItem, clearItem };
