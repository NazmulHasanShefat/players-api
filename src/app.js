import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import playerRouter from "./routes/createPlayerRoute.js";

const app = express();

app.use(cors(
    {
        origin: ["http://localhost:5600"],
        credentials: true,
    }
))
app.use(express.json());
// for save cookie client browser
app.use(cookieParser());


app.use("/api", playerRouter)
export default app;