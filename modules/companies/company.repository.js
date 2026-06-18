const Company = require('./company.model');

function createCompany(data) {
  return Company.create(data);
}

function findAllCompanies() {
  return Company.find().sort({ createdAt: -1 }).lean();
}

function findCompanyById(id) {
  return Company.findById(id).lean();
}

function findCompanyByCode(code) {
  return Company.findOne({ code: String(code).trim().toLowerCase() }).lean();
}

function updateCompanyById(id, data) {
  return Company.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true }).lean();
}

function deleteCompanyById(id) {
  return Company.findByIdAndDelete(id).lean();
}

module.exports = {
  createCompany,
  findAllCompanies,
  findCompanyById,
  findCompanyByCode,
  updateCompanyById,
  deleteCompanyById,
};
