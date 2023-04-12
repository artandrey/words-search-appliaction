const oddEvenMap = function (array, callback) {
  return array.map((el, i, array) => callback(el, i % 2 === 0, i, array));
};

export default oddEvenMap;
