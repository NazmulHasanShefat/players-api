import Player from "../model/players.model.js"

export const getPlayerData = async (req, res)=>{
    try {
        const players = await Player.find();
        if(players.length === 0){
            return res.json({ success: false, message: "No player found"});
        }
        return res.json({
            success: true,
            totalPlayers: players.length,
            players: players
        })
    } catch (error) {
        return res.json({ success: false, message: error.message})
    }
}