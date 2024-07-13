const createError = require('http-errors');

const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
            details: err.errors || []
        }
    });
};

// Middleware to catch 404 and forward to error handler
const notFoundHandler = (req, res, next) => {
    next(createError(404, 'Not Found'));
};

module.exports = { errorHandler, notFoundHandler };
