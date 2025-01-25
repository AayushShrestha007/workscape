const rateLimit = require('express-rate-limit');


// Configure rate limiter
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 5 login attempts per window

    resmessage: {
        success: false,
        message: "Too many login attempts from this IP. Please try again after 15 minutes.",
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = loginLimiter;
