import {Room, Client} from "colyseus";
import {PongState} from "../../shared/state/PongState";
import {PlayerSchema} from "../../shared/schema/PlayerSchema";
import {BallSchema} from "../../shared/schema/BallSchema";
import {UtilsServer} from "../util/UtilsServer.ts";
import {IMessage} from "../../shared/interface/IMessage.ts";
import {BonusSchema} from "../../shared/schema/BonusSchema.ts";
import {IBonusTypes} from "../../shared/interface/IBonusTypes.ts";
import {BulletSchema} from "../../shared/schema/BulletSchema.ts";

// contiene la logica di connessione e le interazioni per una determinata room 'universo di gioco'
// in questo caso qui sarà contenuta tutta la logica di connessione alla stanza che gestisce una partita di pong
export class PongRoom extends Room<PongState> {

    // dimensioni canvas lato client
    // hardcodate qui
    private readonly canvasW: number = 1024;
    private readonly canvasH: number = 768;
    private readonly resetBallPositionX = this.canvasW / 2;
    private readonly resetBallPositionY = this.canvasH / 2;
    private counterDeltaTime: number = 0;
    private utilsServer: UtilsServer;

    // Configurazione della stanza
    onCreate(options: any) {
        console.log("PongRoom creata!", options);

        // instanziamo la pongState
        this.maxClients = 2;
        this.state = new PongState();

        // instanzio direttamente la pallina
        this.state.ball = new BallSchema(this.resetBallPositionX, this.resetBallPositionY)
        this.utilsServer = new UtilsServer(this.state, this.clock);

        // loop nel quale descrivere gli eventi che vanno accadendo sul server
        // UN PO IL METODO UPDATE() CHE HA PHASER!
        // delta time = ogni quanto viene chiamata la funzione (ogni 16ms circa)
        this.setSimulationInterval(deltaTime => {

            // se entrambi i giocatori non sono collegati, la palla non si muove.
            if (this.state.players.size < 2) return;

            this.counterDeltaTime += deltaTime;
            //EVENTI BONUS
            // se determinate condizioni rispettare generare un evento che spawna una moneta che se presa fa il growup del player
            // ogni 20 secondi spawna un bonus
            // il tipo è deciso random

            // se il bonus è ancora attivo, non ne genero un altro
            // finchè quello corrente non è stato
            // "smaltito"
            if (!this.state.bonus.active) {
                if (this.counterDeltaTime >= 10000) {
                    this.counterDeltaTime = 0;
                    const n = Math.random();

                    this.state.bonus = new BonusSchema(this.resetBallPositionX, this.resetBallPositionY);
                    const bonusTypes: IBonusTypes = {
                        type: "growUp"
                    }

                    // evento bonus growUp
                    if (n < 0.5) {
                        this.state.bonus.type = bonusTypes.type // bonus di tipo growUp
                        this.state.bonus.active = true;
                        console.log("generazione nuovo bonus!")
                    } else if (n >= 0.5) {
                        // evento slowed
                        bonusTypes.type = "slowed";
                        this.state.bonus.type = bonusTypes.type
                        this.state.bonus.active = true;
                    }
                }

            }


            if (this.state.bonus.active) {
                // movimento e rimbalzo del bonus
                this.utilsServer.objectMove_x(
                    this.state.bonus
                )

                this.utilsServer.objectMove_y(
                    this.state.bonus
                )

                this.utilsServer.objectBounceFunction(this.state.bonus, this.canvasW, this.canvasH, -1, false)

            }

            // movimento e rimbalzo della palla
            this.utilsServer.objectMove_x(
                this.state.ball
            );
            this.utilsServer.objectMove_y(
                this.state.ball
            );


            // set bounce logic
            this.utilsServer.objectBounceFunction(this.state.ball, this.canvasW, this.canvasH, -1, true);

            this.state.players.forEach(player => {
                if (player) {
                    // controlla se la palla collide con il player
                    this.state.ball && this.utilsServer.checkCollisionWithPlayer(this.state.ball, player, this.resetBallPositionX, this.resetBallPositionY)
                    // controlla se la palla collide con il bonus
                    this.state.bonus && this.utilsServer.checkCollisionWithPlayer(this.state.bonus, player, this.resetBallPositionX, this.resetBallPositionY)
                }
            })

            if (this.state.bullets.size > 0) {
                // se ci soon bullet che sono stati generati li sposto linearmente sull asse x
                this.state.bullets.forEach(bullet => {

                    // se il bullet esce dalla canvas lo elimino
                    if (bullet.x > this.canvasW + 100) {
                        this.state.bullets.delete(bullet.id)
                    }
                    if (bullet.x < -100) {
                        this.state.bullets.delete(bullet.id)
                    }

                    this.utilsServer.objectMove_x(bullet)

                    // controllo collisione tra bullet e player
                    this.state.players.forEach(player => {
                        this.utilsServer.checkCollisionWithPlayer(bullet, player, 9999, 9999)
                    })
                })
            }


        }, 16.16)


        // prendo evento di generazione dle bullet, lo creo e lo sposto di fronte al player che lo ha generato.
        this.onMessage("shot", (client, data: IMessage) => {
            if (data.playerCoord) {
                const id = crypto.randomUUID()
                const bullet = new BulletSchema(id, client.sessionId, data.playerCoord.x, data.playerCoord.y)
                this.state.bullets.set(id, bullet);
                console.log(this.state.bullets)
            }
        })

        // ascoltatore dei messaggi dal client
        // evento di movimento del player
        this.onMessage("move", (client, data: IMessage) => {
            const player = this.state.players.get(client.sessionId);

            // s eil player tocca il margine in alto della canvas
            if (player) {
                if (player.y - player.r < 0) {
                    player.y = player.r + 10
                    return;
                }

                // s eil player tocca il margine in basso della canvas
                if (player.y + player.r > this.canvasH) {
                    player.y = this.canvasH - player.r - 10
                    return;
                }
                // passo 1 o -1 dal client per calcolare lo spostamento positivo o negativo sull asse y
                if (data.direction) {
                    player.y += (player.vy * data.direction)
                }
            }
        })

        // evento di settaggio del nome player
        this.onMessage("set_name", (client, message: IMessage) => {
            const playerServer = this.state.players.get(client.sessionId)
            if (playerServer) {
                playerServer.playerName = message.playerName ? message.playerName : "DEFAULT";
                playerServer.colorName = this.utilsServer.getRandomColor();
            }
        })

    }


    // Quando un giocatore entra
    onJoin(client: Client, _options: any) {

        const size = this.state.players.size;

        if (this.state.players.size === 0) {
            this.state.players.set(client.sessionId, new PlayerSchema(1, 50, this.canvasH / 2));
            console.log("player 1 " + client.sessionId + " si è loggato.")
        } else {
            this.state.players.set(client.sessionId, new PlayerSchema(2, 960, this.canvasH / 2));
            console.log("player 2 " + client.sessionId + " si è loggato.")
        }

        if (this.state.players.size === 1) {
            this.state.gameState = "Attesa secondo giocatore..."
        }

        if (this.state.players.size === 2) {
            this.state.gameState = "";
        }

        console.log(client.sessionId, "giocatore" + size + " si è unito: " + client.sessionId);
    }

    // Quando un giocatore esce
    onLeave(client: Client, _consented: boolean) {
        this.state.players.delete(client.sessionId);
        console.log(client.sessionId, "è uscito!");
    }

    // Quando la stanza viene chiusa
    onDispose() {
        console.log("room disposed");
    }
}