const ApiError = require('../utils/ApiError');

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(new ApiError(400, result.error.issues[0]?.message || 'Validation failed'));
    }

    req[source] = result.data;
    return next();
  };
}

module.exports = validate;
