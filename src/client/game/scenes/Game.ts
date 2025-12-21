import {Scene} from 'phaser';
import * as Colyseus from "colyseus.js";
import {PongState} from "../../../shared/state/PongState";
import {PlayerSchema} from "../../../shared/schema/PlayerSchema";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    private ball: Phaser.GameObjects.Sprite;
    private player1: Phaser.GameObjects.Sprite;
    private player2: Phaser.GameObjects.Sprite;

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

        console.log("VERIFICA SCHEMA:", (PongState as any)._schema);

        // --- LOGICA DI CONNESSIONE ---
        // Istanziamo il client collegandolo a localhost:2567
        this.client = new Colyseus.Client("ws://localhost:2567");

        try {
            // Tentiamo di entrare o creare la stanza 'room' definita nel server
            this.room = await this.client.joinOrCreate<PongState>("pong");

            // la prima volta creo la ball co i dati provenienti dal server.
            this.room.onStateChange.once((pongState: PongState) => {

                // this.room.state.players.onAdd((player: PlayerSchema, sessionId) => {
                //
                //     this.player1 = this.add.sprite(
                //         player.x,
                //         player.y,
                //         "player1"
                //     )
                //
                // })


                this.ball = this.add.sprite(
                    pongState.ball.x,
                    pongState.ball.y,
                    "ball"
                )
                    .setScale(0.12)

            })


            this.room.onStateChange((state: any) => {
                // Controlliamo che la palla sia già stata creata per evitare errori
                if (this.ball) {
                    this.ball.x = state.ball.x;
                    this.ball.y = state.ball.y;
                }
            });


            console.log("Connesso con successo!", this.room);

        } catch (e) {
            console.error("ERRORE CONNESSIONE:", e);
        }
        // -----------------------------


        // --- GESTIONE GIOCATORI ---

    }
}
