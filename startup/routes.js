const express = require('express');
const errorMiddleware = require("../middleware/error");

module.exports = function (app) {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routes
    app.get('/', (req, res) => {
        res.send('welcome to the NODE_WEATHER_API!');
    });

    app.use(errorMiddleware)
    };