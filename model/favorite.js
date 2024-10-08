import mongoose from "mongoose";

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

export default mongoose.model("Favorite", favoriteSchema);
