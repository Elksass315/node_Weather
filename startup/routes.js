import express from 'express';
import errorMiddleware from "../middleware/error.js";
import userRouter from '../routes/user.js';
import authRouter from '../routes/auth.js';
import favoriteRouter from '../routes/favorite.js';
import weatherRouter from '../routes/weather.js';

export default function (app) {
    app.use(express.json());
    
    app.get('/', (req, res) => {
        res.send('welcome to the NODE_WEATHER_API!');
    });
    app.use('/api/weather', weatherRouter);
    app.use('/api/user', userRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/favorite', favoriteRouter);
    app.use(errorMiddleware)
    }