const authService = require('./auth.service');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
