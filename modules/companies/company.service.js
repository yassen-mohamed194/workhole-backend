const ApiError = require('../../shared/utils/ApiError');
const companyRepository = require('./company.repository');

function normalizeCompanyCode(code) {
  return String(code).trim().toLowerCase();
}

function normalizeCompanyName(name) {
  return String(name).trim();
}

async function createCompany(payload) {
  const code = normalizeCompanyCode(payload.code);
  const existingCompany = await companyRepository.findCompanyByCode(code);

  if (existingCompany) {
    throw new ApiError(409, 'Duplicate company code');
  }

  try {
    const company = await companyRepository.createCompany({
      name: normalizeCompanyName(payload.name),
      code,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,
      logo: payload.logo,
      status: payload.status,
    });

    return company.toObject();
  } catch (error) {
    if (error && error.code === 11000) {
      throw new ApiError(409, 'Duplicate company code');
    }
    throw error;
  }
}

async function getCompanies() {
  return companyRepository.findAllCompanies();
}

async function getCompanyById(id) {
  const company = await companyRepository.findCompanyById(id);
  if (!company) {
    throw new ApiError(404, 'Company not found');
  }
  return company;
}

async function updateCompanyById(id, payload) {
  const existingCompany = await companyRepository.findCompanyById(id);
  if (!existingCompany) {
    throw new ApiError(404, 'Company not found');
  }

  const updateData = {};

  if (payload.name !== undefined) {
    updateData.name = normalizeCompanyName(payload.name);
  }

  if (payload.code !== undefined) {
    const code = normalizeCompanyCode(payload.code);
    if (code !== existingCompany.code) {
      const duplicateCompany = await companyRepository.findCompanyByCode(code);
      if (duplicateCompany && String(duplicateCompany._id) !== String(existingCompany._id)) {
        throw new ApiError(409, 'Duplicate company code');
      }
      updateData.code = code;
    }
  }

  if (payload.email !== undefined) {
    updateData.email = payload.email;
  }

  if (payload.phone !== undefined) {
    updateData.phone = payload.phone;
  }

  if (payload.address !== undefined) {
    updateData.address = payload.address;
  }

  if (payload.logo !== undefined) {
    updateData.logo = payload.logo;
  }

  if (payload.status !== undefined) {
    updateData.status = payload.status;
  }

  if (Object.keys(updateData).length === 0) {
    return existingCompany;
  }

  try {
    const updatedCompany = await companyRepository.updateCompanyById(id, updateData);
    if (!updatedCompany) {
      throw new ApiError(404, 'Company not found');
    }
    return updatedCompany;
  } catch (error) {
    if (error && error.code === 11000) {
      throw new ApiError(409, 'Duplicate company code');
    }
    throw error;
  }
}

async function deleteCompanyById(id) {
  const existingCompany = await companyRepository.findCompanyById(id);
  if (!existingCompany) {
    throw new ApiError(404, 'Company not found');
  }

  await companyRepository.deleteCompanyById(id);

  return {
    message: 'Company deleted successfully',
  };
}

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompanyById,
  deleteCompanyById,
};
