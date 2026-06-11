const BreakType = require('./breakTypes.model');

function createBreakType(data) {
  return BreakType.create(data);
}

function findAllActiveBreakTypes() {
  return BreakType.find({ isActive: true }).sort({ createdAt: -1 }).lean();
}

function findBreakTypeById(id) {
  return BreakType.findById(id).lean();
}

function findBreakTypeByName(name) {
  return BreakType.findOne({ name: String(name).trim() }).lean();
}

function updateBreakTypeById(id, data) {
  return BreakType.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true }).lean();
}

module.exports = {
  createBreakType,
  findAllActiveBreakTypes,
  findBreakTypeById,
  findBreakTypeByName,
  updateBreakTypeById,
};
