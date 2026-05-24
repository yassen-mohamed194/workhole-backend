const Role = require('./roles.model');

function createRole(data) {
  return Role.create(data);
}

function findAllRoles() {
  return Role.find().sort({ createdAt: -1 }).lean();
}

function findRoleById(id) {
  return Role.findById(id).lean();
}

function findRoleByName(name) {
  return Role.findOne({ name: String(name).trim().toLowerCase() }).lean();
}

function updateRoleById(id, data) {
  return Role.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true }).lean();
}

function deleteRoleById(id) {
  return Role.findByIdAndDelete(id).lean();
}

module.exports = {
  createRole,
  findAllRoles,
  findRoleById,
  findRoleByName,
  updateRoleById,
  deleteRoleById,
};
