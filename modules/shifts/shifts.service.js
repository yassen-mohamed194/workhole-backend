const ApiError = require('../../shared/utils/ApiError');
const usersRepository = require('../users/users.repository');
const shiftsRepository = require('./shifts.repository');
const { validateShiftTimes } = require('./shifts.utils');

function normalizeShiftName(name) {
  return String(name).trim();
}

function assertValidShiftTimes(startTime, endTime, isNightShift) {
  const validation = validateShiftTimes(startTime, endTime, isNightShift);
  if (!validation.valid) {
    throw new ApiError(400, validation.message);
  }
}

async function createShift(payload) {
  const name = normalizeShiftName(payload.name);
  const existingShift = await shiftsRepository.findShiftByName(name);

  if (existingShift) {
    throw new ApiError(409, 'Shift already exists');
  }

  const isNightShift = payload.isNightShift ?? false;
  assertValidShiftTimes(payload.startTime, payload.endTime, isNightShift);

  try {
    const shift = await shiftsRepository.createShift({
      name,
      startTime: payload.startTime,
      endTime: payload.endTime,
      workingDays: payload.workingDays,
      breakDuration: payload.breakDuration,
      gracePeriod: payload.gracePeriod,
      isNightShift,
      status: payload.status,
    });

    return shift.toObject();
  } catch (error) {
    if (error && error.code === 11000) {
      throw new ApiError(409, 'Shift already exists');
    }
    throw error;
  }
}

async function getShifts() {
  return shiftsRepository.findAllShifts();
}

async function getShiftById(id) {
  const shift = await shiftsRepository.findShiftById(id);
  if (!shift) {
    throw new ApiError(404, 'Shift not found');
  }
  return shift;
}

async function updateShiftById(id, payload) {
  const existingShift = await shiftsRepository.findShiftById(id);
  if (!existingShift) {
    throw new ApiError(404, 'Shift not found');
  }

  const updateData = {};

  if (payload.name !== undefined) {
    const name = normalizeShiftName(payload.name);
    if (name !== existingShift.name) {
      const duplicateShift = await shiftsRepository.findShiftByName(name);
      if (duplicateShift && String(duplicateShift._id) !== String(existingShift._id)) {
        throw new ApiError(409, 'Shift already exists');
      }
      updateData.name = name;
    }
  }

  if (payload.startTime !== undefined) {
    updateData.startTime = payload.startTime;
  }

  if (payload.endTime !== undefined) {
    updateData.endTime = payload.endTime;
  }

  if (payload.workingDays !== undefined) {
    updateData.workingDays = payload.workingDays;
  }

  if (payload.breakDuration !== undefined) {
    updateData.breakDuration = payload.breakDuration;
  }

  if (payload.gracePeriod !== undefined) {
    updateData.gracePeriod = payload.gracePeriod;
  }

  if (payload.isNightShift !== undefined) {
    updateData.isNightShift = payload.isNightShift;
  }

  if (payload.status !== undefined) {
    updateData.status = payload.status;
  }

  if (Object.keys(updateData).length === 0) {
    return existingShift;
  }

  const startTime = updateData.startTime ?? existingShift.startTime;
  const endTime = updateData.endTime ?? existingShift.endTime;
  const isNightShift = updateData.isNightShift ?? existingShift.isNightShift;

  assertValidShiftTimes(startTime, endTime, isNightShift);

  try {
    const updatedShift = await shiftsRepository.updateShiftById(id, updateData);
    if (!updatedShift) {
      throw new ApiError(404, 'Shift not found');
    }
    return updatedShift;
  } catch (error) {
    if (error && error.code === 11000) {
      throw new ApiError(409, 'Shift already exists');
    }
    throw error;
  }
}

async function updateShiftStatusById(id, status) {
  const existingShift = await shiftsRepository.findShiftById(id);
  if (!existingShift) {
    throw new ApiError(404, 'Shift not found');
  }

  const updatedShift = await shiftsRepository.updateShiftById(id, { status });
  if (!updatedShift) {
    throw new ApiError(404, 'Shift not found');
  }

  return updatedShift;
}

async function deleteShiftById(id) {
  const existingShift = await shiftsRepository.findShiftById(id);
  if (!existingShift) {
    throw new ApiError(404, 'Shift not found');
  }

  const assignedUsersCount = await usersRepository.countByShiftId(id);
  if (assignedUsersCount > 0) {
    throw new ApiError(409, 'Shift is assigned to users');
  }

  await shiftsRepository.deleteShiftById(id);

  return {
    message: 'Shift deleted successfully',
  };
}

module.exports = {
  createShift,
  getShifts,
  getShiftById,
  updateShiftById,
  updateShiftStatusById,
  deleteShiftById,
};
