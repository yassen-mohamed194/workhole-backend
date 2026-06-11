const Office = require('./office.model');

function createOffice(data) {
  return Office.create(data);
}

function findAllOffices() {
  return Office.find().sort({ createdAt: -1 }).lean();
}

module.exports = {
  createOffice,
  findAllOffices,
};
