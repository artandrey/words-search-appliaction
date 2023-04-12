const debounce = (callback, delay) => {
  let timeount = null;
  return (...args) => {
    clearTimeout(timeount);
    timeount = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export default debounce;
