import mongoose, { Schema } from "mongoose";

const playerSchema = new Schema(
    {
        name: { type: String, required: true },
        playerImageURL: { type: String, required: true },
        country: { type: String, required: true },
        ability: { type: String, required: true },
        rating: { type: Number, required: true, default: 0 },
        playerType: { type: String, required: true },
        playerPrice: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
);

const Player = mongoose.model("Player", playerSchema);
export default Player