const companyMemberService = require('./companyMember.service');

async function addCompanyMember(req, res, next) {
  try {
    const member = await companyMemberService.addCompanyMember(req.params.companyId, req.body);
    return res.status(201).json({
      status: 'success',
      data: member,
    });
  } catch (error) {
    return next(error);
  }
}

async function getCompanyMembers(req, res, next) {
  try {
    const members = await companyMemberService.getCompanyMembers(req.params.companyId);
    return res.status(200).json({
      status: 'success',
      data: members,
    });
  } catch (error) {
    return next(error);
  }
}

async function getCompanyMember(req, res, next) {
  try {
    const member = await companyMemberService.getCompanyMember(req.params.companyId, req.params.userId);
    return res.status(200).json({
      status: 'success',
      data: member,
    });
  } catch (error) {
    return next(error);
  }
}

async function updateCompanyMember(req, res, next) {
  try {
    const member = await companyMemberService.updateCompanyMember(
      req.params.companyId,
      req.params.userId,
      req.body
    );
    return res.status(200).json({
      status: 'success',
      data: member,
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteCompanyMember(req, res, next) {
  try {
    const result = await companyMemberService.deleteCompanyMember(req.params.companyId, req.params.userId);
    return res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  addCompanyMember,
  getCompanyMembers,
  getCompanyMember,
  updateCompanyMember,
  deleteCompanyMember,
};
