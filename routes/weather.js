import express from 'express';
import { redisClint } from '../startup/redis.js';
import config from 'config';
import winston from 'winston';
import fetch from 'node-fetch';

const router = express.Router();

router.get('/', async (req, res) => {
    const city = req.body.city;

    if (!city) {
        return res.status(400).send('City is required');
    }

    console.log('City:', city);
    try {
        // Check Redis cache first
        redisClint.get(city, async (err, data) => {
            if (err) {
                winston.error('Redis error:', err);
                return res.status(500).send('Internal server error');
            }

            console.log('Data:', data)
            if (data) {
                // If cached data exists, return it
                return res.send(JSON.parse(data));
            } else {
                // If no cached data, fetch from API
                const apiKey = config.get('weatherApiKey');
                if (!apiKey) {
                    winston.error('Weather API key is not set');
                    return res.status(500).send('Internal server error');
                }
                console.log('API Key:', apiKey)
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

                try {
                    const apiResponse = await fetch(url);
                    const weatherData = await apiResponse.json();

                    if (apiResponse.ok) {
                        console.log('Weather Data:', weatherData);
                        // Cache the data in Redis (optional: set expiration time, e.g., 3600 seconds = 1 hour)
                        redisClint.setex(city, 3600, JSON.stringify(weatherData));
                        return res.send(weatherData);
                    } else {
                        return res.status(apiResponse.status).send(weatherData);
                    }
                } catch (apiErr) {
                    winston.error('API error:', apiErr);
                    return res.status(500).send('Error fetching weather data');
                }
            }
        });
    } catch (err) {
        winston.error('Error:', err);
        return res.status(500).send('Internal server error');
    }
});

export default router;
