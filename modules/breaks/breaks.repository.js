const Break = require('./breaks.model');

function createBreak(payload) {
  return Break.create(payload);
}

function findAllBreaks() {
  return Break.find().sort({ createdAt: -1 });
}

module.exports = {
  createBreak,
  findAllBreaks,
};
