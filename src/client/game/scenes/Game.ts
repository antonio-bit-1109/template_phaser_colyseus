import {Scene} from 'phaser';
import * as Colyseus from "colyseus.js"; // <--- IMPORTANTE

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;

    client: Colyseus.Client;
    room: Colyseus.Room;

    constructor() {
        super('Game');
    }

    async create() {
        this.camera = this.cameras.main;

        this.background = this.add.image(
            this.game.config.width as number / 2,
            this.game.config.height as number / 2,
            'sfondo');

        this.background.setScale(1.1, 1.3);

        // --- LOGICA DI CONNESSIONE ---
        // Istanziamo il client collegandolo a localhost:2567
        this.client = new Colyseus.Client("ws://localhost:2567");

        try {
            // Tentiamo di entrare o creare la stanza 'my_room' definita nel server
            const room = await this.client.joinOrCreate("my_room");

            console.log("Connesso con successo!", room);

        } catch (e) {
            console.error("ERRORE CONNESSIONE:", e);
        }
        // -----------------------------


        // --- GESTIONE GIOCATORI ---
        
    }
}
