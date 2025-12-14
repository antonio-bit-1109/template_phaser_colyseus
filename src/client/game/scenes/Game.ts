import {Scene} from 'phaser';
import * as Colyseus from "colyseus.js";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    private ball: Phaser.GameObjects.Arc;

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
            // Tentiamo di entrare o creare la stanza 'room' definita nel server
            this.room = await this.client.joinOrCreate("pong");

            this.room.onStateChange.once((state: any) => {

                this.ball = this.add.circle(
                    this.room.state.ball.x,
                    this.room.state.ball.y,
                    30,
                    0xffffff
                )

                // Attiviamo l'ascolto per i movimenti futuri
                state.ball.listen("x", (newX: number) => this.ball.x = newX);
                state.ball.listen("y", (newY: number) => this.ball.y = newY);

            })


            console.log("Connesso con successo!", this.room);

        } catch (e) {
            console.error("ERRORE CONNESSIONE:", e);
        }
        // -----------------------------


        // --- GESTIONE GIOCATORI ---

    }
}
