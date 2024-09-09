const express = require('express');
const router = express.Router();
const Favorite = require('../model/favorite');
const auth = require('../middleware/auth');

router.get('/add', auth, async (req, res) => {
    try {

        const city = req.body.city
        if (!city) {
            res.status(401).send("No city provided")
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
        res.status(500).json({ message: 'Error adding city to favorites', error });
    }
});

router.delete('/favorites/delete', auth,async (req, res) => {
    try {
        const userId = req.user._id;
        const city =  req.body.city;

        const favorite = await Favorite.findOne({ user: userId });

        if (!favorite) {
            return res.status(404).json({ message: 'No favorite cities found for user' });
        }
        
        favorite.favoriteCity = favorite.favoriteCity.filter(c => c !== city);

        await favorite.save();
        res.status(200).json({ message: 'City removed from favorites', favorite });
    } catch (error) {
        res.status(500).json({ message: 'Error removing city from favorites', error });
    }
});

module.exports = router;