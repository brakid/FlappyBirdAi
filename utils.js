function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

const sum = (previous, current) => previous + current;
const count = (previous, current) => previous + 1;