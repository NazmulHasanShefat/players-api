import express from "express";
import { createPlayer } from "../controllers/createPlayer.js";
import { getPlayerData } from "../controllers/getPlayerData.js";
import { isAuthenticated, login, logout, register, sendPasswordResetOtp, sendVerifyOtp, verifyandSetResetOtp, verifyOtp } from "../controllers/userAuthControler.js";
import { userAuth } from "../middleware/userAuth.js";

const playerRouter = express.Router();
// this us or create routers
playerRouter.post("/register", register);
playerRouter.post("/login", login);
playerRouter.post("/logout", logout);
playerRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
playerRouter.post("/verify-otp", userAuth, verifyOtp);
playerRouter.post("/is-authentic", userAuth, isAuthenticated);
playerRouter.post("/sendpas-reset-otp", userAuth, sendPasswordResetOtp);
playerRouter.post("/verify-reset-otp", userAuth, verifyandSetResetOtp);
playerRouter.post("/create-player", createPlayer)

playerRouter.post("/create-player", createPlayer);
playerRouter.get("/all-players", getPlayerData);

export default playerRouter;