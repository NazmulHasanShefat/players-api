import express from "express";
import { createPlayer } from "../controllers/createPlayer.js";
import { getPlayerData } from "../controllers/getPlayerData.js";

const playerRouter = express.Router();

playerRouter.post("/create-player", createPlayer);
playerRouter.get("/all-players", getPlayerData);

export default playerRouter;