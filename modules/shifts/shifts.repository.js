const Shift = require('./shifts.model');

function createShift(payload) {
  return Shift.create(payload);
}

function findAllShifts() {
  return Shift.find().sort({ createdAt: -1 });
}

module.exports = {
  createShift,
  findAllShifts,
};
