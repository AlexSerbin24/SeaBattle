import express from "express";
import http from "http";
import websocketSetup from "./websockets/websockets.js";

const app = express();
const server = http.createServer(app);
websocketSetup(server);

app.listen(5000,()=>{console.log("server has started")});