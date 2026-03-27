import Player from "../model/players.model.js";


export const createPlayer = async (req, res)=>{
    const { name, country, ability, rating, playerType, playerPrice, playerImageURL } = req.body;
    if(!name || !country || !ability || !rating || !playerType || !playerPrice || !playerImageURL ){
        return res.json({ success: false, message: "players inputs are required"});
    }
    try {
        const existingPlayer = await Player.findOne({ name });
        if(existingPlayer){
            return res.json({ success: false, message: "same player alrady exist"});
        }
        const newPlayer = new Player({  name, playerImageURL, country, ability, rating, playerType, playerPrice });
        await newPlayer.save();
        return res.json({ success: true, message: "player added successfully"});
    } catch (error) {
        return res.json(
            {success: false, message: error.message}
        )
    }
}