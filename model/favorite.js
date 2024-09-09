const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    favoriteCity: {
        type: [String],
        required: true
    },
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;