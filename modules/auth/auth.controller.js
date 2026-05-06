const authService = require('./auth.service');

async function login(req, res, next) {
  try {
    const { identifier, password } = req.body;
    const data = await authService.login(identifier, password);
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    return next(error);
  }
}

async function changePassword(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    await authService.changePassword(userId, oldPassword, newPassword);
    return res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
    });
  } catch (error) {
    return next(error);
  }
}

async function refreshToken(req, res, next) {
  try {
    const { refreshToken: token } = req.body;
    const data = await authService.refreshToken(token);
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    return next(error);
  }
}

async function logout(req, res, next) {
  try {
    const { refreshToken: token } = req.body;
    await authService.logout(token);
    return res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
  changePassword,
  refreshToken,
  logout,
};
