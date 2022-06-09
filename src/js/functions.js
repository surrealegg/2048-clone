function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function createElement(type, className) {}

Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};
