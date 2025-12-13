import { Server } from "colyseus";
import { createServer } from "http";
import express from "express";
import { MyRoom } from "./rooms/MyRoom";

const port = 2567;
const app = express();

// Crea il server HTTP
const gameServer = new Server({
    server: createServer(app)
});

// Definisci le stanze di gioco
gameServer.define('my_room', MyRoom);

// Avvia il server
void gameServer.listen(port);
console.log(`[GameServer] Listening on Port: ${port}`);