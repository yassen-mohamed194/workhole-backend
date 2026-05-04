const User = require('./users.model');

function createUser(payload) {
  return User.create(payload);
}

function findByEmail(email) {
  return User.findOne({ email });
}

function findByEmailWithPassword(email) {
  return User.findOne({ email: String(email).trim().toLowerCase() }).select('+password');
}

function findAll() {
  return User.find().select('-password').sort({ createdAt: -1 });
}

function findById(id) {
  return User.findById(id).select('-password');
}

function updateById(id, data) {
  return User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-password');
}

function deleteById(id) {
  return User.findByIdAndDelete(id);
}

function updateStatusById(id, status) {
  return User.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).select('-password');
}

module.exports = {
  createUser,
  findByEmail,
  findByEmailWithPassword,
  findAll,
  findById,
  updateById,
  deleteById,
  updateStatusById,
};
