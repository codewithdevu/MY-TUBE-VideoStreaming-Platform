import dotenv from "dotenv";
import path from "path";
import https from "https";
import connectDb from "./database/connection.js";
import app from "./app.js";

// Load environment variables
dotenv.config({
    path: path.resolve(process.cwd(), ".env")
});

const PORT = process.env.PORT || 8000;
const SERVER_URL = process.env.SERVER_URL || "https://divyansh-tube-api.onrender.com/health";

// 🔄 KEEP-ALIVE SELF PINGER (Pings public endpoint every 10 minutes to delay Render sleep)
const startKeepAlivePinger = () => {
    const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes
    setInterval(() => {
        https.get(SERVER_URL, (res) => {
            console.log(`📡 [Keep-Alive]: Auto ping sent to ${SERVER_URL} (Status: ${res.statusCode})`);
        }).on("error", (err) => {
            console.error("⚠️ [Keep-Alive Error]:", err.message);
        });
    }, PING_INTERVAL);
};

// Directly Start Persistent Render/Local Server
const startServer = async () => {
    try {
        await connectDb();
        
        // 🟢 Pure Persistent Listener (No more Vercel serverless confusion!)
        app.listen(PORT, () => {
            console.log(`🚀 Server running smoothly on Port: ${PORT}`);
            startKeepAlivePinger();
        });
    } catch (err) {
        console.error("❌ Critical System Boot FAILED:", err);
        process.exit(1);
    }
};

startServer();

export default app;