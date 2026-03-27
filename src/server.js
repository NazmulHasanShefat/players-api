import express from "express";
import { configDotenv } from "dotenv";
import dns from "dns"
import app from "./app.js";
import { dbConnect } from "./db/dbConnection.js";
configDotenv();
dns.setServers(["1.1.1.1","8.8.8.8"]);

dbConnect()
.then(()=>{
    app.listen(process.env.PORT || 5000, ()=>{
        console.log(`server is running on port http://localhost:${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("server catch error on server.js error:",err);
})
