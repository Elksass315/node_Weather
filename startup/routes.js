const express = require('express');

const weatherRouter = require('../routes/weather');
const userRouter = require('../routes/user');
const authRouter = require('../routes/auth');
const favoriteRouter = require('../routes/favorite');

const errorMiddleware = require("../middleware/error");
const c = require('config');

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
    app.use('/api/favorite', favoriteRouter);

    app.use(errorMiddleware)
    };