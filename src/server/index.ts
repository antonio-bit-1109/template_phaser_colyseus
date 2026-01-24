import {Server} from "colyseus";
import {createServer} from "http";
import express from "express";
import cors from "cors";
import path from "path"; // <--- Importa path
import {PongRoom} from "./rooms/PongRoom";

const port = Number(process.env.PORT || 2567);
const app = express();

app.use(cors());
app.use(express.json());

// --- MODIFICA FONDAMENTALE PER LA PRODUZIONE ---
// Diciamo a Express di servire i file statici dalla cartella "../client"
// (Nota: in produzione la cartella 'client' sarà accanto alla cartella 'server' compilata)
const clientDistPath = path.join(__dirname, "..", "client");
app.use(express.static(clientDistPath));

// Qualsiasi richiesta che non sia api/websocket restituisce index.html (per Phaser)
app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
});
// -----------------------------------------------

const gameServer = new Server({
    server: createServer(app)
});

gameServer.define('pong', PongRoom);

gameServer.listen(port);
console.log(`[GameServer] Listening on Port: ${port}`);