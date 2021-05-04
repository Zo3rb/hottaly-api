require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

// Connect The Database
require('./db')();

// Registering The Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());


// Registering The Routers Here
app.use('/api', require('./views/auth'));
app.use('/api', require('./views/stripe'));
app.use('/api', require('./views/hotels'));

// Starting the Application
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Application Started Successfully"));
