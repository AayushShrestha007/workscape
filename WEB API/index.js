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

//dotenv configuration
dotenv.config()

const https = require('https');

const options = {
    key: fs.readFileSync('/Users/ayush/Desktop/Softwarica 6th Semester/Security/Certificates/server.key'),
    cert: fs.readFileSync('/Users/ayush/Desktop/Softwarica 6th Semester/Security/Certificates/server.crt'),
}

//create an express application
const app = express();

app.use(helmet());


app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"], // Restrict default sources
            scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts (if necessary)
            objectSrc: ["'none'"], // Disallow object elements
            imgSrc: ["'self'", "data:", "http://localhost:5500"], // Allow images from the same origin and inline data
            connectSrc: ["'self'", "http://localhost:5500"], // Allow API requests to your backend
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

//configure cors policy
const corsOptions = {
    origin: ["https://localhost:3000", "http://localhost:5500"],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionSuccessStatus: 200,
    allowedHeaders: "Content-Type,Authorization",
}

//configuring rate limit to protect against DOS attack
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes.",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

//implementing rate limiter
app.use(limiter);

app.use(cors(corsOptions))



//express json config
app.use(express.json())

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


//config form data
app.use(acceptFormData());



app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "https://localhost:3000");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type,Authorization"
    );
    next();
});


//using the port defined in env
const PORT = process.env.PORT;

//Making a test endpoint
app.get('/test', (req, res) => {
    res.send("Test api is working for Job Mate");
})


// Starting the server
// https.createServer(options, app).listen(PORT, () => {
//     console.log(`HTTPS server is running on port ${PORT}!`);

// });



app.listen(PORT, () => {
    console.log(`server is now running on port ${PORT}!`);
})

module.exports = app;