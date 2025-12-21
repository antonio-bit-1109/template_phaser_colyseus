import {Room, Client} from "colyseus";
import {PongState} from "../../shared/state/PongState";
import {PlayerSchema} from "../../shared/schema/PlayerSchema";
import {BallSchema} from "../../shared/schema/BallSchema";
import {GameFunctions} from "../functions/GameFunctions";


// export interface IEdges {
//     value: number,
//     position: "top" | "bottom" | "left" | "right"
// }


// contiene la logica di connessione e le interazioni per una determinata room 'universo di gioco'
// in questo caso qui sarà contenuta tutta la logica di connessione alla stanza che gestisce una partita di pong
export class PongRoom extends Room<PongState> {

    // dimensioni canvas lato client
    // hardcodate qui
    private canvasW: number = 1024;
    private canvasH: number = 768;
    private gameFunctions: GameFunctions;
    private movingIncrement: number = 4;
    private directionX: number = Math.floor(Math.random() * 2);
    private directionY: number = Math.floor(Math.random() * 2);
    private resetBallPositionX = this.canvasW / 2;
    private resetBallPositionY = this.canvasH / 2;
    private counterSimulationInterval = 0;


    // Configurazione della stanza
    onCreate(options: any) {
        console.log("PongRoom creata!", options);

        // instanziamo la pongState
        this.maxClients = 2;
        this.state = new PongState();

        // instanzio direttamente la pallina
        this.state.ball = new BallSchema(this.resetBallPositionX, this.resetBallPositionY)
        this.gameFunctions = new GameFunctions();

        // loop nel quale descrivere gli eventi che vanno accadendo sul server
        // UN PO IL METODO UPDATE() CHE HA PHASER!
        // delta time = ogni quanto viene chiamata la funzione (ogni 16ms circa)
        this.setSimulationInterval(deltaTime => {

            this.counterSimulationInterval += deltaTime;

            this.state.ball.x = this.gameFunctions.ballMove_x(
                this.state.ball.x,
                this.directionX === 0 ? this.movingIncrement : -this.movingIncrement
            );

            this.state.ball.y = this.gameFunctions.ballMove_y(
                this.state.ball.y,
                this.directionY === 0 ? -this.movingIncrement : this.movingIncrement
            );

            if (this.counterSimulationInterval >= 2000) {
                // resetto counter che registra tempo passato nel setSimulationInterval
                this.counterSimulationInterval = 0;

                // resetto le variabili che determinano direzione x e y della palla.
                this.directionX = Math.floor(Math.random() * 2);
                this.directionY = Math.floor(Math.random() * 2);

                this.gameFunctions.resetBall(
                    this.state.ball,
                    this.resetBallPositionX,
                    this.resetBallPositionY
                )
            }

            // if (this.state.ball.x > 800 || this.state.ball.x < 800) {
            //     this.gameFunctions.resetBall(
            //         this.state.ball,
            //         this.resetBallPositionX,
            //         this.resetBallPositionY
            //     )
            // }

            //set bounce logic
            // this.gameFunctions.ballBounceFunction(
            //     this.state.ball,
            //     this.canvasW,
            //     this.canvasH
            // )

        }, 16.16)

    }

    // Quando un giocatore entra
    onJoin(client: Client, options: any) {

        const size = this.state.players.size;

        if (this.state.players.size === 0) {
            this.state.players.set(client.sessionId, new PlayerSchema(100, this.canvasW / 2));
        } else {
            this.state.players.set(client.sessionId, new PlayerSchema(900, this.canvasW / 2));
        }


        console.log(client.sessionId, "giocatore" + size + " si è unito: " + client.sessionId);

        if (size === 2) {
            this.state.gameState = "Pronti a giocare!"
        } else {
            this.state.gameState = "Attesa giocatore 2 ..."
        }
    }

    // Quando un giocatore esce
    onLeave(client: Client, consented: boolean) {
        this.state.players.delete(client.sessionId);
        console.log(client.sessionId, "è uscito!");
    }

    // Quando la stanza viene chiusa
    onDispose() {
        console.log("room disposed");
    }
}