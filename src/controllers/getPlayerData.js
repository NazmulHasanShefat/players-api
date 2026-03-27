import Player from "../model/players.model.js"

export const getPlayerData = async (req, res)=>{
    const { name, country, ability } = req.query;
    const quaryObj = {};
    if(country){
        quaryObj.country = { $regex: country, $options: "i"}
    }
    if(ability){
        quaryObj.ability = { $regex: ability, $options: "i"}
    }
    if(name){
        quaryObj.name = { $regex: name, $options: "i"}
    }
    try {
        const players = await Player.find(quaryObj);
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