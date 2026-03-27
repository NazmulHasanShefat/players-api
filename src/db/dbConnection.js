import mongoose from "mongoose";

export const dbConnect = async ()=>{
    try {
        const dbConnectionInstance = await mongoose.connect(process.env.DB_URL);
        console.log("✅ db conneted successfully", dbConnectionInstance.connection.host);
    } catch (error) {
        console.log("❌ db connection faild", error.message);
    }
}