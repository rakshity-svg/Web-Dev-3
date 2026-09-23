// Custom Logger Middleware (Logs Method, URL, Time)
const logger = (req, res, next) => {
    const time = new Date().toISOString();
    console.log(`[${time}] ${req.method} ${req.originalUrl}`);
    next();
};

module.exports = logger;
