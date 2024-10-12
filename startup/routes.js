import express from 'express';
import errorMiddleware from "../middleware/error.js";
import userRouter from '../routes/user.js';
import authRouter from '../routes/auth.js';
import favoriteRouter from '../routes/favorite.js';
import weatherRouter from '../routes/weather.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, '../swagger.json'), 'utf8'));

export default function (app) {
    app.use(express.json());
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.get('/', (req, res) => {
        res.send('welcome to the NODE_WEATHER_API!');
    });
    app.use('/api/weather', weatherRouter);
    app.use('/api/user', userRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/favorite', favoriteRouter);
    app.use(errorMiddleware)
    }