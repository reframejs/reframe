module.exports = listener

listener(...args) {
  return JSON.stringify(args);
}
