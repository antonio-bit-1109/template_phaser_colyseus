import {Scene} from 'phaser';
import * as Colyseus from "colyseus.js";
import {PongState} from "../../../shared/state/PongState";
import {PlayerSchema} from "../../../shared/schema/PlayerSchema.ts";
import Sprite = Phaser.GameObjects.Sprite;

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    private ball: Phaser.GameObjects.Sprite;
    private players: Map<string, PlayerSchema> = new Map<string, PlayerSchema>();
    private player1: Sprite;
    private player2: Sprite;

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

            console.log("Room State Object:", this.room.state);

            // ogni volta che lo stato cambia:
            this.room.onStateChange((pongState: PongState) => {


                // GESTIONE PALLA
                if (pongState.ball) {
                    // se la palla non esiste la creo
                    if (!this.ball) {
                        this.ball = this.add.sprite(
                            pongState.ball.x,
                            pongState.ball.y,
                            "ball"
                        )
                            .setScale(0.08)
                    } else {
                        // altrimenti l'aggiorno
                        this.ball.x = this.room.state.ball.x;
                        this.ball.y = this.room.state.ball.y;
                    }
                }


                // GESTIONE GIOCATORI
                pongState.players.forEach((player, sessionId) => {

                    if (!this.players.get(sessionId) && !this.player1) {
                        this.players.set(sessionId, player);
                        this.player1 = this.physics.add.sprite(
                            player.x,
                            player.y,
                            "player1"
                        )
                            .setScale(0.3)
                            .setRotation(Phaser.Math.DegToRad(-90))
                    }

                    if (!this.players.get(sessionId) && !this.player2) {
                        this.players.set(sessionId, player);
                        this.player2 = this.physics.add.sprite(
                            player.x,
                            player.y,
                            "player2"
                        )
                            .setScale(0.3)
                            .setRotation(Phaser.Math.DegToRad(90))
                    }

                })
            })


            console.log("Connesso con successo!", this.room);

        } catch (e) {
            console.error("ERRORE CONNESSIONE:", e);
        }
        // -----------------------------


        // --- GESTIONE GIOCATORI ---

    }
}
