const breaksService = require('./breaks.service');

async function startBreak(req, res, next) {
  try {
    const breakRecord = await breaksService.startBreak(req.user.id, req.body);
    return res.status(201).json({
      status: 'success',
      data: breakRecord,
    });
  } catch (error) {
    return next(error);
  }
}

async function endBreak(req, res, next) {
  try {
    const breakRecord = await breaksService.endBreak(req.user.id);
    return res.status(200).json({
      status: 'success',
      data: breakRecord,
    });
  } catch (error) {
    return next(error);
  }
}

async function getTodayBreaks(req, res, next) {
  try {
    const result = await breaksService.getTodayBreaks(req.user.id);
    return res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

async function getBreakHistory(req, res, next) {
  try {
    const result = await breaksService.getBreakHistory(req.user.id, req.query);
    return res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

async function getBreakById(req, res, next) {
  try {
    const breakRecord = await breaksService.getBreakById(req.params.id, req.user);
    return res.status(200).json({
      status: 'success',
      data: breakRecord,
    });
  } catch (error) {
    return next(error);
  }
}

async function getBreakSummary(req, res, next) {
  try {
    const summary = await breaksService.getBreakSummary(req.user.id);
    return res.status(200).json({
      status: 'success',
      data: summary,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  startBreak,
  endBreak,
  getTodayBreaks,
  getBreakHistory,
  getBreakById,
  getBreakSummary,
};
