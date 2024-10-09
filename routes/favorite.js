import express from 'express';
import Favorite from '../model/favorite.js';
import auth from '../middleware/auth.js';
import winston from 'winston';

const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {

        const city = req.body.city
        if (!city) {
            res.status(401).send("No city provided")
            return
        }
        let favorite = await Favorite.findOne({ user: req.user._id });

        if (!favorite) {
            favorite = new Favorite({ user: req.user._id, favoriteCity: [city] });
        } else {
            if (!favorite.favoriteCity.includes(city)) {
                favorite.favoriteCity.push(city);
            }
        }

        await favorite.save();
        res.send({ message: 'City added to favorites', favorite });
    } catch (error) {
        winston.error(error.message);
        res.status(500).send('Error adding city to favorites' );
    }
});

router.delete('/', auth,async (req, res) => {
    try {
        const userId = req.user._id;
        const city =  req.body.city;

        const favorite = await Favorite.findOne({ user: userId });

        if (!favorite) {
            return res.status(404).json({ message: 'No favorite cities found for user' });
        }
        
        favorite.favoriteCity = favorite.favoriteCity.filter(c => c !== city);
res.sta
        await favorite.save();
        res.status(200).json({ message: 'City removed from favorites', favorite });
    } catch (error) {
        winston.error(error.message);
        res.status(500).json('Error removing city from favorites' );
    }
});


export default router;