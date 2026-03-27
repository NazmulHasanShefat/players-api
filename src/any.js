// player.controller.js search funcnalitys add
import Player from "../model/players.model.js";
import connectDB from "../db/connectDB.js";

export const searchPlayer = async (req, res) => {
    try {
        await connectDB();
        
        const { query } = req.query; // ?query=shakib

        if (!query) {
            return res.status(400).json({ 
                success: false, 
                message: "Search query is required" 
            });
        }

        const players = await Player.find({
            $or: [
                { name: { $regex: query, $options: "i" } },        // i = case insensitive
                { country: { $regex: query, $options: "i" } },
                { playerType: { $regex: query, $options: "i" } },
                { ability: { $regex: query, $options: "i" } },
            ]
        });

        if (players.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "No players found" 
            });
        }

        return res.status(200).json({
            success: true,
            totalResults: players.length,
            players: players
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};


// player.routes.js
import { searchPlayer } from "../controller/player.controller.js";

router.get("/search", searchPlayer);
```

**Postman এ test:**
```
// // নাম দিয়ে search
// GET → http://localhost:5000/api/players/search?query=shakib

// // দেশ দিয়ে search
// GET → http://localhost:5000/api/players/search?query=bangladesh

// // player type দিয়ে search
// GET → http://localhost:5000/api/players/search?query=bowler