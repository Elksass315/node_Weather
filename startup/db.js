const mongoose = require("mongoose");
const config = require("config");
const winston = require("winston");

module.exports = function () {
    mongoose.connect(config.get("db"),
    ).then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
    });
}