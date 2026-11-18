const notFoundHandler = (req, res) => {
    res.status(404).json({ message: 'Route not found' });
};

const errorHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ message: 'Invalid JSON payload' });
    }

    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((item) => item.message);
        return res.status(400).json({ message: 'Validation failed', errors });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
    }

    if (err.code === 11000) {
        const duplicateField = Object.keys(err.keyValue || {})[0] || 'field';
        const duplicateValue = err.keyValue ? err.keyValue[duplicateField] : '';
        return res.status(409).json({
            message: `Duplicate value for ${duplicateField}: ${duplicateValue}`
        });
    }

    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 ? 'Internal server error' : err.message;
    return res.status(statusCode).json({ message });
};

module.exports = {
    notFoundHandler,
    errorHandler
};
