const attendanceService = require('./attendance.service');

async function createOffice(req, res, next) {
  try {
    const office = await attendanceService.createOffice(req.body);
    return res.status(201).json({
      status: 'success',
      data: office,
    });
  } catch (error) {
    return next(error);
  }
}

async function getOffices(req, res, next) {
  try {
    const offices = await attendanceService.getOffices();
    return res.status(200).json({
      status: 'success',
      data: offices,
    });
  } catch (error) {
    return next(error);
  }
}

async function checkIn(req, res, next) {
  try {
    const attendance = await attendanceService.checkIn(req.user.id, req.body);
    return res.status(200).json({
      status: 'success',
      data: attendance,
    });
  } catch (error) {
    return next(error);
  }
}

async function checkOut(req, res, next) {
  try {
    const attendance = await attendanceService.checkOut(req.user.id, req.body);
    return res.status(200).json({
      status: 'success',
      data: attendance,
    });
  } catch (error) {
    return next(error);
  }
}

async function getTodayAttendance(req, res, next) {
  try {
    const attendance = await attendanceService.getTodayAttendance(req.user.id);
    return res.status(200).json({
      status: 'success',
      data: attendance,
    });
  } catch (error) {
    return next(error);
  }
}

async function getAttendanceHistory(req, res, next) {
  try {
    const result = await attendanceService.getAttendanceHistory(req.user.id, req.query);
    return res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

async function getAttendanceLogs(req, res, next) {
  try {
    const result = await attendanceService.getAttendanceLogs(req.query);
    return res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

async function getAttendanceById(req, res, next) {
  try {
    const attendance = await attendanceService.getAttendanceById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: attendance,
    });
  } catch (error) {
    return next(error);
  }
}

async function getAttendanceSummary(req, res, next) {
  try {
    const summary = await attendanceService.getAttendanceSummary(req.user.id);
    return res.status(200).json({
      status: 'success',
      data: summary,
    });
  } catch (error) {
    return next(error);
  }
}

async function getMonthlyAttendanceSummary(req, res, next) {
  try {
    const summary = await attendanceService.getMonthlyAttendanceSummary(
      req.user.id,
      req.query.month,
      req.query.year
    );
    return res.status(200).json({
      status: 'success',
      data: summary,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createOffice,
  getOffices,
  checkIn,
  checkOut,
  getTodayAttendance,
  getAttendanceHistory,
  getAttendanceLogs,
  getAttendanceById,
  getAttendanceSummary,
  getMonthlyAttendanceSummary,
};
