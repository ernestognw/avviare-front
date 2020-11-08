const list = (toList) => {
  let str = '';
  toList.forEach((value, index) => {
    if (index === toList.length - 2) {
      str += `${value} y `;
    } else if (index === toList.length - 1) {
      str += value;
    } else {
      str += `${value}, `;
    }
  });

  return str;
};

export { list };
