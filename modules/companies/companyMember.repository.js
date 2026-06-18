const CompanyMember = require('./companyMember.model');

const MEMBER_POPULATE = [
  { path: 'userId', select: 'firstName lastName email phone status' },
  { path: 'roleId', select: 'name permissions isSystem' },
];

function createCompanyMember(data) {
  return CompanyMember.create(data);
}

function findCompanyMember(companyId, userId) {
  return CompanyMember.findOne({ companyId, userId }).populate(MEMBER_POPULATE).lean();
}

function findCompanyMemberById(id) {
  return CompanyMember.findById(id).populate(MEMBER_POPULATE).lean();
}

function findCompanyMembers(companyId) {
  return CompanyMember.find({ companyId })
    .populate(MEMBER_POPULATE)
    .sort({ createdAt: -1 })
    .lean();
}

function updateCompanyMember(companyId, userId, data) {
  return CompanyMember.findOneAndUpdate({ companyId, userId }, data, {
    returnDocument: 'after',
    runValidators: true,
  })
    .populate(MEMBER_POPULATE)
    .lean();
}

function deleteCompanyMember(companyId, userId) {
  return CompanyMember.findOneAndDelete({ companyId, userId }).lean();
}

function countByRoleId(roleId) {
  return CompanyMember.countDocuments({ roleId });
}

module.exports = {
  createCompanyMember,
  findCompanyMember,
  findCompanyMemberById,
  findCompanyMembers,
  updateCompanyMember,
  deleteCompanyMember,
  countByRoleId,
};
