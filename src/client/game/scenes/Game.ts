import {Scene} from 'phaser';
import * as Colyseus from "colyseus.js";
import {PongState} from "../../../shared/state/PongState";
import Sprite = Phaser.GameObjects.Sprite;
import {IMessage} from "../../../shared/interface/IMessage.ts";
import Text = Phaser.GameObjects.Text;
import {UtilsClient} from "../util/UtilsClient.ts";

export class Game extends Scene {

    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    private utilsClient: UtilsClient;
    private lastShotTime: number = 0;
    private ball: Phaser.GameObjects.Sprite;
    private readonly players: Map<string, Sprite> = new Map<string, Sprite>();
    private readonly namesMap: Map<string, Text> = new Map<string, Text>();
    private readonly pointsMap: Map<string, Text> = new Map<string, Text>();
    private readonly bulletsMap: Map<string, Sprite> = new Map<string, Sprite>();
    private playerName: string = "";
    private messageFromServer: Text;
    private bonusNotified = false;
    private bonus: Sprite | null = null;


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

            this.utilsClient = new UtilsClient(this)
            // ogni volta che lo stato cambia:
            this.room.onStateChange((pongState: PongState) => {


                // controllo lo stato del bonus
                // se non esiste lo creo
                if (
                    pongState.bonus &&
                    pongState.bonus.active &&
                    // pongState.bonus.type === "growUp" &&
                    !this.bonusNotified
                ) {
                    this.bonusNotified = true

                    if (pongState.bonus.type === "growUp") {
                        this.bonus = this.add.sprite(
                            pongState.bonus.x,
                            pongState.bonus.y,
                            "bonusGrowUp"
                        ).setScale(0.5)
                    } else if (pongState.bonus.type === "slowed") {
                        this.bonus = this.add.sprite(
                            pongState.bonus.x,
                            pongState.bonus.y,
                            "malusSlowed"
                        ).setScale(0.5)
                            .setRotation(Phaser.Math.DegToRad(180))
                    }


                } else {
                    // altrimenti aggiorno la sua posizione
                    if (this.bonus) {
                        this.bonus.setX(pongState.bonus.x);
                        this.bonus.setY(pongState.bonus.y)
                    }
                }


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
                    // popolo la mappa con un text riportante il punteggio del giocaotre
                    if (!this.pointsMap.get(sessionId)) {
                        const points = this.add.text(
                            this.utilsClient.setDisplayPoints(player.index, this.game.config.width as number),
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

                    // se lo stato del bonus è riportato inattivo, significa che ha colpito un player,
                    // lo distruggo dalla scena e applico il bonus allo sprite del giocatore
                    // controllando solamente il raggio del playerschema
                    if (pongState.bonus && !pongState.bonus.active) {
                        this.bonusNotified = false;
                        this.bonus?.destroy(true);

                        const playerSprite = this.players.get(sessionId)
                        if (playerSprite) {
                            // per miglior effetto visivo uso un tweens (crescita lineare dello scale da 0.3 a 0.5
                            //playerSprite.setScale(player.r === 45 ? 0.5 : 0.3)
                            if (player.r === 45) {
                                this.tweens.add({
                                    targets: playerSprite,
                                    scale: 0.5,
                                    duration: 500,
                                    ease: 'Linear'
                                })
                            }

                            if (player.r === 30) {
                                this.tweens.add({
                                    targets: playerSprite,
                                    scale: 0.3,
                                    duration: 500,
                                    ease: 'Linear'
                                })
                            }
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

                        // quando creo il player gli aggiungo le due barre della vita nel client
                        this.utilsClient.createLowerHpBar(player, sessionId)
                        this.utilsClient.createUpperHpBar(player, sessionId)


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
                                player.y - 100,
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
                            playerSprite.setScale(
                                player.r === 45 ? 0.5 : 0.3
                            )
                            this.utilsClient.updateLowerPositionBar(player, sessionId)
                            this.utilsClient.updateUpperPositionBar(player, sessionId)
                            // se il playersprite ha una velocita y = 2 significa che ha preso malus "slowed"
                            // e lo tingo di un rosso chiaro
                            if (player.vy === 4) {
                                playerSprite.setTint(0xFF9999)
                            } else if (player.vy === 8) {
                                playerSprite.clearTint()
                            }
                        }


                        // se dal server mi torna il nome dle player
                        // prendo la mappa k-v dei nomi e aggiorno la posizione
                        if (player.playerName) {
                            const tagText = this.namesMap.get(sessionId)
                            if (tagText) {
                                tagText.setX(player.x - 15)
                                tagText.setY(player.y - 100)
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

                // GESTIONE PROIETTILI
                // se nel server esistono proiettili, li mostro

                pongState.bullets.forEach(bullet => {

                    if (!this.bulletsMap.get(bullet.id)) {
                        const b = this.add.sprite(
                            bullet.x,
                            bullet.y,
                            "bullet"
                        )

                        // se il proiettile sta venendo sparato dal giocatore 2 ruoto lo sprite
                        if (bullet.initialX > 500) {
                            b.setRotation(Phaser.Math.DegToRad(180))
                            b.setTint(0xFF0000)
                        }

                        this.bulletsMap.set(bullet.id, b)
                    } else {
                        const bSprite = this.bulletsMap.get(bullet.id);
                        bSprite?.setX(bullet.x)
                    }

                    const widthCanvas = this.game.config.width as number
                    // quando il proiettile supera le dimensioni della canva sulla x lo cancello anche dal client
                    if (
                        bullet.x > widthCanvas ||
                        bullet.x < 0
                    ) {
                        this.utilsClient.deleteBulletFromClient(bullet.id, this.bulletsMap)
                        console.log("bullet fuori dalla canvas : " + bullet.x + " eliminato!")
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

        if (!this.room || !this.room.state || !this.room.state.players) return;

        if (!this.room) return;

        const message: IMessage = {
            direction: 0
        }

        // movimento up down
        if (this.utilsClient.getCursor().up.isDown) {
            message.direction = -1;
            this.room.send("move", message)
        }

        if (this.utilsClient.getCursor().down.isDown) {
            message.direction = 1;
            this.room.send("move", message)
        }

        // mi serve di sapere chi sta generando il bullet
        const player = this.room.state.players.get(this.room.sessionId);
        if (!player) return;


        // press space per sparare (generare bullet sul server)
        // just down registra un solo evento per press della key
        if (Phaser.Input.Keyboard.JustDown(this.utilsClient.getCursor().space)) {
            message.playerCoord = {x: player.x, y: player.y}

            // posso sparare solo una volta ogni secondo
            if (time > this.lastShotTime + 1000) {
                this.room.send("shot", message)

                this.lastShotTime = time;
            }


        }

        // se il bullet è cancellato lato server, perche ha colpito un player,
        // lo cancello anche lato client
        Array.from(this.bulletsMap.keys()).forEach(bulletId => {

            if (!this.room.state.bullets.has(bulletId)) {
                this.utilsClient.deleteBulletFromClient(bulletId, this.bulletsMap)
            }
        })
    }
}
