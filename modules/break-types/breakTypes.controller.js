const breakTypesService = require('./breakTypes.service');

async function createBreakType(req, res, next) {
  try {
    const breakType = await breakTypesService.createBreakType(req.body);
    return res.status(201).json({
      status: 'success',
      data: breakType,
    });
  } catch (error) {
    return next(error);
  }
}

async function getBreakTypes(req, res, next) {
  try {
    const breakTypes = await breakTypesService.getBreakTypes();
    return res.status(200).json({
      status: 'success',
      data: breakTypes,
    });
  } catch (error) {
    return next(error);
  }
}

async function getBreakTypeById(req, res, next) {
  try {
    const breakType = await breakTypesService.getBreakTypeById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: breakType,
    });
  } catch (error) {
    return next(error);
  }
}

async function updateBreakTypeById(req, res, next) {
  try {
    const breakType = await breakTypesService.updateBreakTypeById(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      data: breakType,
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteBreakTypeById(req, res, next) {
  try {
    const result = await breakTypesService.deleteBreakTypeById(req.params.id);
    return res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createBreakType,
  getBreakTypes,
  getBreakTypeById,
  updateBreakTypeById,
  deleteBreakTypeById,
};
