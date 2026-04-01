import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import playerRouter from "./routes/createPlayerRoute.js";

const app = express();

app.use(cors(
    {
        origin: function (origin, callback) {
            callback(null, true); // সব origin allow (undefined হলেও)
        },
        credentials: true,
    }
))

app.use(express.json());
// for save cookie client browser
app.use(cookieParser());



app.use("/api", playerRouter);

app.get("/", (req, res) => {
    res.json({ success: true, message: "welcome to players server" })
})
export default app;