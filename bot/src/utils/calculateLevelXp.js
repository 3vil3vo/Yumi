module.exports = (level) => {
  switch (level) {
    case 1:
      return 25000;
    case 2:
      return 50000;
    case 3:
      return 100000;
    case 4:
      return 250000;
    case 5:
      return 500000;
    case 6:
      return 1000000;
    case 7:
      return 1001000;
    case 8:
      return 1002000;
    case 9:
      return 1003000;
    default:
      return 10000;
  }
};
