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

function findByIdentifier(identifier) {
  const value = String(identifier).trim();
  if (value.includes('@')) {
    return User.findOne({ email: value.toLowerCase() }).select('+password');
  }
  return User.findOne({ phone: value }).select('+password');
}

function findAll() {
  return User.find().select('-password').sort({ createdAt: -1 });
}

function findById(id) {
  return User.findById(id).select('-password');
}

function findByIdWithPassword(id) {
  return User.findById(id).select('+password');
}

function findByIdWithRefreshToken(id) {
  return User.findById(id);
}

function updateById(id, data) {
  return User.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true }).select('-password');
}

function updatePasswordById(id, password) {
  return User.findByIdAndUpdate(id, { password }, { returnDocument: 'after', runValidators: true });
}

function updateRefreshTokenById(id, refreshToken) {
  return User.findByIdAndUpdate(id, { refreshToken }, { returnDocument: 'after', runValidators: true });
}

function deleteById(id) {
  return User.findByIdAndDelete(id);
}

function updateStatusById(id, status) {
  return User.findByIdAndUpdate(id, { status }, { returnDocument: 'after', runValidators: true }).select('-password');
}

module.exports = {
  createUser,
  findByEmail,
  findByEmailWithPassword,
  findByIdentifier,
  findAll,
  findById,
  findByIdWithPassword,
  findByIdWithRefreshToken,
  updateById,
  updatePasswordById,
  updateRefreshTokenById,
  deleteById,
  updateStatusById,
};
