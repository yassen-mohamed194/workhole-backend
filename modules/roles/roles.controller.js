const rolesService = require('./roles.service');

async function createRole(req, res, next) {
  try {
    const role = await rolesService.createRole(req.body);
    return res.status(201).json({
      status: 'success',
      data: role,
    });
  } catch (error) {
    return next(error);
  }
}

async function getRoles(req, res, next) {
  try {
    const roles = await rolesService.getRoles();
    return res.status(200).json({
      status: 'success',
      data: roles,
    });
  } catch (error) {
    return next(error);
  }
}

async function getRoleById(req, res, next) {
  try {
    const role = await rolesService.getRoleById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: role,
    });
  } catch (error) {
    return next(error);
  }
}

async function updateRoleById(req, res, next) {
  try {
    const role = await rolesService.updateRoleById(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      data: role,
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteRoleById(req, res, next) {
  try {
    const result = await rolesService.deleteRoleById(req.params.id);
    return res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  updateRoleById,
  deleteRoleById,
};
