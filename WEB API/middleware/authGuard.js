const jwt = require('jsonwebtoken');
require('dotenv').config();


const authGuard = (req, res, next) => {
    // Check incoming data
    console.log(req.headers);

    // Get authorization data from headers
    const authHeader = req.headers.authorization;

    // Check or validate
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Authorization header not found',
        });
    }

    // Split the data (Format: 'Bearer token) - only token
    const token = authHeader.split(' ')[1];

    // If token not found: stop the process (send res)
    if (!token || token === '') {
        return res.status(401).json({
            success: false,
            message: 'Token not found',
        });
    }

    // Verify
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); // If verified: next(function in controller)
    } catch (error) {
        console.log('JWT verification error:', error);
        res.status(401).json({
            success: false,
            message: 'Not authorized',
            error: error.message,
        });
    }
};


//creating employer guard

const roleGuard = (role) => (req, res, next) => {
    // Check incoming data
    console.log(req.headers);

    // Get authorization data from headers
    const authHeader = req.headers.authorization;

    // Check or validate
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Authorization header not found',
        });
    }

    // Split the data (Format: 'Bearer token) - only token
    const token = authHeader.split(' ')[1];

    // If token not found: stop the process (send res)
    if (!token || token === '') {
        return res.status(401).json({
            success: false,
            message: 'Token not found',
        });
    }

    // Verify
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; //id 
        if (req.user.role !== role) {
            return res.status(400).json({
                success: false,
                message: 'Access unauthorized to applicants',
            });
        }
        next(); // If verified: next(function in controller)
    } catch (error) {
        console.log('JWT verification error:', error);
        res.status(400).json({
            success: false,
            message: "Your access was not authorized",
            error: error.message,
        });
    }
};

// Admin guard
const adminGuard = (req, res, next) => {

    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admins only."
        });
    }
    next(); // Proceed if the user is an admin
};


module.exports = {
    adminGuard,
    authGuard,
    roleGuard
};
