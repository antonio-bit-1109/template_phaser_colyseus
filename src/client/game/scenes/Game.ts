import {Scene} from 'phaser';
import * as Colyseus from "colyseus.js";
import {PongState} from "../../../shared/state/PongState";
import Sprite = Phaser.GameObjects.Sprite;
import {Movementsmanager} from "../util/Movementsmanager.ts";
import {IMessage} from "../../../shared/interface/IMessage.ts";
import Text = Phaser.GameObjects.Text;

export class Game extends Scene {

    private movementManager: Movementsmanager;

    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    private ball: Phaser.GameObjects.Sprite;
    private readonly players: Map<string, Sprite> = new Map<string, Sprite>();
    private playerName: string = "";
    private tag1: Text | null = null;
    private tag2: Text | null = null;
    private namesMap: Map<string, string> = new Map<string, string>()

    client: Colyseus.Client;
    room: Colyseus.Room;

    constructor() {
        super('game');
    }

    init(data: any) {
        this.playerName = data.name ? data.name : "DEFAULT"
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


            this.movementManager = new Movementsmanager(this)

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


                    // se non trovo il player
                    if (!this.players.get(sessionId)) {
                        const p = this.add.sprite(
                            player.x,
                            player.y,
                            this.players.size === 0 ? "player1" : "player2",
                        )
                            .setScale(0.3)
                            .setRotation(Phaser.Math.DegToRad(
                                this.players.size === 0 ? -90 : 90)
                            )
                        this.players.set(sessionId, p);

                        // se il giocatore nonha ancora un nome glielo fornisco da quello inserito nel client precedentemente
                        // inviandolo al server
                        if (player.playerName === "") {
                            const message: IMessage = {
                                playerName: this.playerName
                            }
                            this.room.send("set_name", message)

                        }

                    } else {

                        if (player.playerName) {
                            this.namesMap.set(sessionId, player.playerName)
                        }

                        const playerSprite = this.players.get(sessionId)
                        if (playerSprite) {
                            playerSprite.setX(player.x)
                            playerSprite.setY(player.y);

                        }

                        this.namesMap.forEach((_) => {
                            if (!this.tag1) {
                                this.tag1 = this.add.text(
                                    player.x + 30,
                                    player.y - 30,
                                    player.playerName
                                )
                            }

                            if (this.tag1) {
                                this.tag2 = this.add.text(
                                    player.x + 30,
                                    player.y - 30,
                                    player.playerName
                                )
                            }


                        })

                        if (this.tag1) {
                            this.tag1
                                .setX(player.x + 30)
                                .setY(player.y - 30)
                        }

                        if (this.tag2) {
                            this.tag2
                                .setX(player.x + 30)
                                .setY(player.y - 30)
                        }
                    }


                })

            })


            console.log("Connesso con successo!", this.room);

        } catch (e) {
            console.error("ERRORE CONNESSIONE:", e);
        }

    }


    update(time: number, delta: number) {
        super.update(time, delta);

        if (!this.room) return;

        const message: IMessage = {
            direction: 0
        }

        if (this.movementManager.getCursor().up.isDown) {
            message.direction = -4;
            this.room.send("move", message)
        }

        if (this.movementManager.getCursor().down.isDown) {
            message.direction = +4;
            this.room.send("move", message)
        }

    }
}
