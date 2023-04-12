const memoize = (callback) => {
  let result;
  return () => {
    if (!result) result = callback();
    return result;
  };
};

export default memoize;
