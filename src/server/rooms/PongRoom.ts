import {Room, Client} from "colyseus";
import {PongState} from "../../shared/state/PongState";
import {PlayerSchema} from "../../shared/schema/PlayerSchema";
import {BallSchema} from "../../shared/schema/BallSchema";
import {GameFunctions} from "../functions/GameFunctions";
import {IMessage} from "../../shared/interface/IMessage.ts";
import {StyleManager} from "../../client/game/util/styleManager.ts";
import {Movementsmanager} from "../../client/game/util/Movementsmanager.ts";
import {BonusSchema} from "../../shared/schema/BonusSchema.ts";
import {IBonusTypes} from "../../shared/interface/IBonusTypes.ts";

// contiene la logica di connessione e le interazioni per una determinata room 'universo di gioco'
// in questo caso qui sarà contenuta tutta la logica di connessione alla stanza che gestisce una partita di pong
export class PongRoom extends Room<PongState> {

    // dimensioni canvas lato client
    // hardcodate qui
    private readonly canvasW: number = 1024;
    private readonly canvasH: number = 768;
    private gameFunctions: GameFunctions;
    private readonly resetBallPositionX = this.canvasW / 2;
    private readonly resetBallPositionY = this.canvasH / 2;
    private readonly styleManager: StyleManager = new StyleManager();
    private readonly movementmanager: Movementsmanager = new Movementsmanager();
    private counterDeltaTime: number = 0;


    // Configurazione della stanza
    onCreate(options: any) {
        console.log("PongRoom creata!", options);

        // instanziamo la pongState
        this.maxClients = 2;
        this.state = new PongState();

        // instanzio direttamente la pallina
        this.state.ball = new BallSchema(this.resetBallPositionX, this.resetBallPositionY)
        this.gameFunctions = new GameFunctions(this.state);

        // loop nel quale descrivere gli eventi che vanno accadendo sul server
        // UN PO IL METODO UPDATE() CHE HA PHASER!
        // delta time = ogni quanto viene chiamata la funzione (ogni 16ms circa)
        this.setSimulationInterval(deltaTime => {

            this.counterDeltaTime += deltaTime;
            // se entrambi i giocatori non sono collegati, la palla non si muove.
            if (this.state.players.size < 2) return;

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
                    const growUpType: IBonusTypes = {
                        type: "growUp"
                    }

                    // evento bonus growUp
                    // if (n === 0 || n < 0.3) {
                    if (n) {
                        this.state.bonus.type = growUpType.type // bonus di tipo growUp
                        this.state.bonus.active = true;
                        console.log("generazione nuovo bonus!")
                    }
                }
                
            }

            // movimento e rimbalzo del bonus
            this.gameFunctions.objectMove_x(
                this.state.bonus
            )

            this.gameFunctions.objectMove_y(
                this.state.bonus
            )

            this.gameFunctions.objectBounceFunction(this.state.bonus, this.canvasW, this.canvasH, -1, false)

            // movimento e rimbalzo della palla
            this.gameFunctions.objectMove_x(
                this.state.ball
            );
            this.gameFunctions.objectMove_y(
                this.state.ball
            );

            // set bounce logic
            this.gameFunctions.objectBounceFunction(this.state.ball, this.canvasW, this.canvasH, -1, true);
            this.state.players.forEach(player => {
                if (player) {
                    this.gameFunctions.checkCollisionWithPlayer(this.state.ball, player)
                }
            })

        }, 16.16)


        // ascoltatore dei messaggi dal client
        this.onMessage("move", (client, data: IMessage) => {
            const player = this.state.players.get(client.sessionId);
            if (player) {
                if (player.y - player.r < 0) {
                    player.y = player.r + 10
                    return;
                }

                if (player.y + player.r > this.canvasH) {
                    player.y = this.canvasH - player.r - 10
                    return;
                }
                player.y += data.direction ? this.movementmanager.addAccelerationToPlayerMovement(data.direction) : 0;
            }
        })

        this.onMessage("set_name", (client, message: IMessage) => {
            const playerServer = this.state.players.get(client.sessionId)
            if (playerServer) {
                playerServer.playerName = message.playerName ? message.playerName : "DEFAULT";
                playerServer.colorName = this.styleManager.getRandomColor();
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