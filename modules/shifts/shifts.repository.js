const Shift = require('./shifts.model');

function createShift(data) {
  return Shift.create(data);
}

function findAllShifts() {
  return Shift.find().sort({ createdAt: -1 }).lean();
}

function findShiftById(id) {
  return Shift.findById(id).lean();
}

function findShiftByName(name) {
  return Shift.findOne({ name: String(name).trim() }).lean();
}

function updateShiftById(id, data) {
  return Shift.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true }).lean();
}

function deleteShiftById(id) {
  return Shift.findByIdAndDelete(id).lean();
}

module.exports = {
  createShift,
  findAllShifts,
  findShiftById,
  findShiftByName,
  updateShiftById,
  deleteShiftById,
};
