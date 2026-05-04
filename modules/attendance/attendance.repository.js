const Attendance = require('./attendance.model');

function createAttendance(payload) {
  return Attendance.create(payload);
}

function findAllAttendance() {
  return Attendance.find().sort({ createdAt: -1 });
}

module.exports = {
  createAttendance,
  findAllAttendance,
};
