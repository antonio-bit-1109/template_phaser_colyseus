import {Room, Client} from "colyseus";
import {PongState} from "../../shared/state/PongState";
import {PlayerSchema} from "../../shared/schema/PlayerSchema";
import {BallSchema} from "../../shared/schema/BallSchema";
import {GameFunctions} from "../functions/GameFunctions";

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

            this.gameFunctions.ballMove_x(
                this.state.ball
            );

            this.gameFunctions.ballMove_y(
                this.state.ball
            );

            // set bounce logic
            this.gameFunctions.ballBounceFunction(this.state.ball, this.canvasW, this.canvasH);


        }, 16.16)

    }

    // Quando un giocatore entra
    onJoin(client: Client, _options: any) {

        const size = this.state.players.size;

        if (this.state.players.size === 0) {
            this.state.players.set(client.sessionId, new PlayerSchema(50, this.canvasH / 2));
            console.log("player 1 " + client.sessionId + " si è loggato.")
        } else {
            this.state.players.set(client.sessionId, new PlayerSchema(950, this.canvasH / 2));
            console.log("player 2 " + client.sessionId + " si è loggato.")
        }


        console.log(client.sessionId, "giocatore" + size + " si è unito: " + client.sessionId);

        if (size === 2) {
            this.state.gameState = "Pronti a giocare!"
        } else {
            this.state.gameState = "Attesa giocatore 2 ..."
        }
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