const shiftsService = require('./shifts.service');

async function createShift(req, res, next) {
  try {
    const shift = await shiftsService.createShift(req.body);
    return res.status(201).json({
      status: 'success',
      data: shift,
    });
  } catch (error) {
    return next(error);
  }
}

async function getShifts(req, res, next) {
  try {
    const shifts = await shiftsService.getShifts();
    return res.status(200).json({
      status: 'success',
      data: shifts,
    });
  } catch (error) {
    return next(error);
  }
}

async function getShiftById(req, res, next) {
  try {
    const shift = await shiftsService.getShiftById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: shift,
    });
  } catch (error) {
    return next(error);
  }
}

async function updateShiftById(req, res, next) {
  try {
    const shift = await shiftsService.updateShiftById(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      data: shift,
    });
  } catch (error) {
    return next(error);
  }
}

async function updateShiftStatusById(req, res, next) {
  try {
    const shift = await shiftsService.updateShiftStatusById(req.params.id, req.body.status);
    return res.status(200).json({
      status: 'success',
      data: shift,
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteShiftById(req, res, next) {
  try {
    const result = await shiftsService.deleteShiftById(req.params.id);
    return res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createShift,
  getShifts,
  getShiftById,
  updateShiftById,
  updateShiftStatusById,
  deleteShiftById,
};
