import express from "express";
import http from "http";
import dotenv from "dotenv"
import websocketSetup from "./websockets/websockets.js";
import connectToDb from "./data/connectionToDb.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

websocketSetup(server);
connectToDb();

app.listen(5000,()=>{console.log("server has started")})