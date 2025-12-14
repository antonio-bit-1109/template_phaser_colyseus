import {Server} from "colyseus";
import {createServer} from "http";
import express from "express";
import {PongRoom} from "./rooms/PongRoom.ts";

const port = 2567;
const app = express();

// Crea il server HTTP
const gameServer = new Server({
    server: createServer(app)
});

// Definisci le stanze di gioco
gameServer.define('pong', PongRoom);

// Avvia il server
void gameServer.listen(port);
console.log(`[GameServer] Listening on Port: ${port}`);