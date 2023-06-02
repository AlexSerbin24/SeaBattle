import express from "express";
import http from "http";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import websocketSetup from "./websockets/websockets.js";
import connectToDb from "./config/db.js";
import userRouter from "./routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(bodyParser.json())
app.use(cookieParser());
app.use(cors())
app.use("/user",userRouter);
const server = http.createServer(app);


websocketSetup(server);
connectToDb();

app.listen(5000,()=>{console.log("server has started")})