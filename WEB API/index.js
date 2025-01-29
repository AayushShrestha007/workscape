const express = require('express');
const connectDatabase = require('./database/database')
const dotenv = require('dotenv')
const cors = require('cors');
const fs = require('fs');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const acceptFormData = require('express-fileupload')
const rateLimit = require('express-rate-limit');
const { MongoClient } = require('mongodb');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const { xss } = require('express-xss-sanitizer');
const https = require('https');

//dotenv configuration
dotenv.config()


//create an express application
const app = express();

const key = fs.readFileSync('../Certificates/server.key');
const cert = fs.readFileSync('../Certificates/server.crt');
const httpsOptions = { key, cert };


//configure cors policy
const corsOptions = {
    origin: ["https://localhost:3000", "https://localhost:5500"],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionSuccessStatus: 200,
    allowedHeaders: "Content-Type,Authorization,X-CSRF-Token, XSRF-TOKEN",
}

app.use(cors(corsOptions))

// Parse cookies
// app.use(cookieParser());


// app.use(
//     csrf({
//         cookie: {
//             key: 'XSRF-TOKEN',
//             httpOnly: false,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'Lax',
//         },
//     })
// );

// // Define the CSRF token route
// app.get('/api/csrf-token', (req, res) => {
//     res.cookie('XSRF-TOKEN', req.csrfToken(), {
//         httpOnly: false,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'Lax',
//     });
//     res.json({ csrfToken: req.csrfToken() });
// });


// app.use((err, req, res, next) => {
//     if (err.code === 'EBADCSRFTOKEN') {
//         // CSRF token validation failed
//         res.status(403).json({ message: 'Invalid CSRF token' });
//     } else {
//         next(err);
//     }
// });




app.use(helmet());



app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"], // Restrict default sources
            scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts (if necessary)
            objectSrc: ["'none'"], // Disallow object elements
            imgSrc: ["'self'", "data:", "https://localhost:5500"], // Allow images from the same origin and inline data
            connectSrc: ["'self'", "https://localhost:5500"], // Allow API requests to your backend
        },
    })
);

//Allowing cross origin for images and resume

app.use('/userImage', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

app.use('/employerImage', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

app.use('/userResume', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});



//configuring rate limit to protect against DOS attack
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes.",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

//implementing rate limiter
app.use(limiter);



//express json config
app.use(express.json())

app.use(express.urlencoded({ extended: true }));

//implementing mongo sanitize
app.use(
    mongoSanitize({
        replaceWith: '_', // Optional: replaces prohibited characters with '_'
    })
);

app.use(xss());


//make a static public folder
app.use(express.static("./public"))


// for handling file uploads
app.use(fileUpload());


//connect to database
connectDatabase();

//configuring routes 
app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/job', require('./routes/jobRoutes'))
app.use('/api/employer', require('./routes/employerRoutes'))
app.use('/api/resume', require('./routes/resumeRoutes'))
app.use('/api/resume', require('./routes/resumeRoutes'))
app.use('/api/applications', require('./routes/applicationRoutes'))
app.use('/api/payment', require('./routes/paymentRoutes'))
app.use('/api/activity', require('./routes/activityRoutes'))


//config form data
app.use(acceptFormData());

//commented to make xsrf work
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     res.setHeader("Access-Control-Allow-Origin", "https://localhost:3000");
//     res.setHeader(
//         "Access-Control-Allow-Methods",
//         "GET,POST,PUT,PATCH,DELETE,OPTIONS"
//     );
//     res.setHeader(
//         "Access-Control-Allow-Headers",
//         "Content-Type,Authorization,X-CSRF-Token"
//     );
//     next();
// });


//using the port defined in env
const PORT = process.env.PORT;

//Making a test endpoint for mongo sanitize
app.post('/test', (req, res) => {
    res.send(req.body);
})



// Create HTTPS server
const server = https.createServer(httpsOptions, app);


// Starting the server
server.listen(5500, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
});


module.exports = app;