const express = require('express');

const weatherRouter = require('../routes/weather');
const userRouter = require('../routes/user');
const authRouter = require('../routes/auth');

const errorMiddleware = require("../middleware/error");

module.exports = function (app) {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routes
    app.get('/', (req, res) => {
        res.send('welcome to the NODE_WEATHER_API!');
    });
    app.use('/api/weather', weatherRouter);
    app.use('/api/user', userRouter);
    app.use('/api/auth', authRouter);

    app.use(errorMiddleware)
    };