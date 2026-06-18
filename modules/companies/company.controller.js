const companyService = require('./company.service');

async function createCompany(req, res, next) {
  try {
    const company = await companyService.createCompany(req.body);
    return res.status(201).json({
      status: 'success',
      data: company,
    });
  } catch (error) {
    return next(error);
  }
}

async function getCompanies(req, res, next) {
  try {
    const companies = await companyService.getCompanies();
    return res.status(200).json({
      status: 'success',
      data: companies,
    });
  } catch (error) {
    return next(error);
  }
}

async function getCompanyById(req, res, next) {
  try {
    const company = await companyService.getCompanyById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: company,
    });
  } catch (error) {
    return next(error);
  }
}

async function updateCompanyById(req, res, next) {
  try {
    const company = await companyService.updateCompanyById(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      data: company,
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteCompanyById(req, res, next) {
  try {
    const result = await companyService.deleteCompanyById(req.params.id);
    return res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompanyById,
  deleteCompanyById,
};
