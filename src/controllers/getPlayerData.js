import Player from "../model/players.model.js"

export const getPlayerData = async (req, res)=>{
    // query for search
    const { query } = req.query;
    // query for filter
    const { name, country, ability } = req.query; 
    const queryObj = {};
    
    if(country){
        queryObj.country = { $regex: country, $options: "i"}
    }
    if(ability){
        queryObj.ability = { $regex: ability, $options: "i"}
    }
    if(name){
        queryObj.name = { $regex: name, $options: "i"}
    }

    try {
        if(query){
            const players = await Player.find({
                $or: [
                    { name: {$regex: query, $options:"i" }},
                    { country: {$regex: query, $options:"i" }},
                    { playerType: {$regex: query, $options:"i" }},
                    { ability: {$regex: query, $options:"i" }},
                ]
            });
            if(players.length === 0){
                return res.json({ success: false, message: "No player found"});
            }
            return res.json({
                success: true,
                totalPlayers: players.length,
                players: players
            })
        }else{
            const players = await Player.find(queryObj);
              if(players.length === 0){
                return res.json({ success: false, message: "No player found"});
            }
            return res.json({
                success: true,
                totalPlayers: players.length,
                players: players
            })
        }

    } catch (error) {
        return res.json({ success: false, message: error.message})
    }
}