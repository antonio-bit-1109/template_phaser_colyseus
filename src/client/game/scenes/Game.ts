import {Scene} from 'phaser';
import * as Colyseus from "colyseus.js";
import {PongState} from "../../../shared/state/PongState";
import Sprite = Phaser.GameObjects.Sprite;
import {Movementsmanager} from "../util/Movementsmanager.ts";
import {IMessage} from "../../../shared/interface/IMessage.ts";
import Text = Phaser.GameObjects.Text;
import {StyleManager} from "../util/styleManager.ts";

export class Game extends Scene {

    private movementManager: Movementsmanager;
    private styleManager: StyleManager;
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    private ball: Phaser.GameObjects.Sprite;
    private readonly players: Map<string, Sprite> = new Map<string, Sprite>();
    private playerName: string = "";
    private readonly namesMap: Map<string, Text> = new Map<string, Text>();
    private messageFromServer: Text;
    private pointsMap: Map<string, Text> = new Map<string, Text>();

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
            this.styleManager = new StyleManager()
            // ogni volta che lo stato cambia:
            this.room.onStateChange((pongState: PongState) => {


                if (!this.messageFromServer) {
                    this.messageFromServer = this.add.text(
                        this.game.config.width as number / 2,
                        this.game.config.height as number / 4.5,
                        pongState.gameState,
                        {
                            fontSize: 50
                        }
                    ).setOrigin(0.5, 0.5)
                } else {
                    this.messageFromServer.text = pongState.gameState;
                }


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

                    // se nella mappa dei punteggi non è presente id sessione dell utente,
                    // popolo la mappa

                    if (!this.pointsMap.get(sessionId)) {
                        const points = this.add.text(
                            this.styleManager.setDisplayPoints(player.index, this.game.config.width as number),
                            this.game.config.height as number / 25,
                            player.playerPoints.toString(),
                            {
                                fontSize: 120
                            }
                        )
                        this.pointsMap.set(sessionId, points)
                    } else {
                        const pointsRef = this.pointsMap.get(sessionId);
                        if (pointsRef) {
                            pointsRef.setText(player.playerPoints.toString())
                        }
                    }

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

                        // se la mappa dei nomi nonha ancora un key-value con il session id dell utente
                        // creo un set k-v con sessionId - Text
                        if (!this.namesMap.get(sessionId)) {
                            const nameTag = this.add.text(
                                player.x - 15,
                                player.y - 70,
                                player.playerName,
                                {
                                    color: player.colorName,
                                    strokeThickness: 4
                                }
                            )
                            this.namesMap.set(sessionId, nameTag);
                        }

                        const playerSprite = this.players.get(sessionId)
                        if (playerSprite) {
                            playerSprite.setX(player.x)
                            playerSprite.setY(player.y);

                        }

                        // se dal server mi torna il nome dle player
                        // prendo la mappa k-v dei nomi e aggiorno la posizione
                        if (player.playerName) {
                            const tagText = this.namesMap.get(sessionId)
                            if (tagText) {
                                tagText.setX(player.x - 15)
                                tagText.setY(player.y - 70)
                            }
                        }
                    }

                })

                // gestione logica player cancellati dal server
                // se sul server un player non c'è più (identificato dalla session id)
                // lo cancello dal client, insieme al suo tag nome.
                Array.from(this.players.keys()).forEach((sessionId) => {
                    if (!this.room.state.players.has(sessionId)) {

                        this.players.get(sessionId)?.destroy(true);
                        this.namesMap.get(sessionId)?.destroy(true);
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
