function parseTimeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function validateShiftTimes(startTime, endTime, isNightShift) {
  if (startTime === endTime) {
    return {
      valid: false,
      message: 'startTime and endTime cannot be identical',
    };
  }

  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  if (startMinutes < endMinutes) {
    return { valid: true };
  }

  if (isNightShift) {
    return { valid: true };
  }

  return {
    valid: false,
    message: 'endTime must be after startTime unless isNightShift is true',
  };
}

module.exports = {
  validateShiftTimes,
};
