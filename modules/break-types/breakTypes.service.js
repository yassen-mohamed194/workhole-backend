const ApiError = require('../../shared/utils/ApiError');
const breakTypesRepository = require('./breakTypes.repository');

function normalizeBreakTypeName(name) {
  return String(name).trim();
}

async function createBreakType(payload) {
  const name = normalizeBreakTypeName(payload.name);
  const existingBreakType = await breakTypesRepository.findBreakTypeByName(name);

  if (existingBreakType) {
    throw new ApiError(409, 'Break type already exists');
  }

  try {
    const breakType = await breakTypesRepository.createBreakType({
      name,
      durationMinutes: payload.durationMinutes,
    });

    return breakType.toObject();
  } catch (error) {
    if (error && error.code === 11000) {
      throw new ApiError(409, 'Break type already exists');
    }
    throw error;
  }
}

async function getBreakTypes() {
  return breakTypesRepository.findAllActiveBreakTypes();
}

async function getBreakTypeById(id) {
  const breakType = await breakTypesRepository.findBreakTypeById(id);
  if (!breakType) {
    throw new ApiError(404, 'Break type not found');
  }
  return breakType;
}

async function updateBreakTypeById(id, payload) {
  const existingBreakType = await breakTypesRepository.findBreakTypeById(id);
  if (!existingBreakType) {
    throw new ApiError(404, 'Break type not found');
  }

  const updateData = {};

  if (payload.name !== undefined) {
    const name = normalizeBreakTypeName(payload.name);
    if (name !== existingBreakType.name) {
      const duplicateBreakType = await breakTypesRepository.findBreakTypeByName(name);
      if (duplicateBreakType && String(duplicateBreakType._id) !== String(existingBreakType._id)) {
        throw new ApiError(409, 'Break type already exists');
      }
      updateData.name = name;
    }
  }

  if (payload.durationMinutes !== undefined) {
    updateData.durationMinutes = payload.durationMinutes;
  }

  if (Object.keys(updateData).length === 0) {
    return existingBreakType;
  }

  try {
    const updatedBreakType = await breakTypesRepository.updateBreakTypeById(id, updateData);
    if (!updatedBreakType) {
      throw new ApiError(404, 'Break type not found');
    }
    return updatedBreakType;
  } catch (error) {
    if (error && error.code === 11000) {
      throw new ApiError(409, 'Break type already exists');
    }
    throw error;
  }
}

async function deleteBreakTypeById(id) {
  const existingBreakType = await breakTypesRepository.findBreakTypeById(id);
  if (!existingBreakType) {
    throw new ApiError(404, 'Break type not found');
  }

  // Soft delete: set isActive to false
  await breakTypesRepository.updateBreakTypeById(id, { isActive: false });

  return {
    message: 'Break type deleted successfully',
  };
}

module.exports = {
  createBreakType,
  getBreakTypes,
  getBreakTypeById,
  updateBreakTypeById,
  deleteBreakTypeById,
};
