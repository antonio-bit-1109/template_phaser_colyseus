import {Room, Client} from "colyseus";
import {PongState} from "../state/PongState.ts";
import {PlayerSchema} from "../schema/PlayerSchema.ts";
import {BallSchema} from "../schema/BallSchema.ts";


// contiene la logica di connessione e le interazioni per una determinata room 'universo di gioco'
// in questo caso qui sarà contenuta tutta la logica di connessione alla stanza che gestisce una partita di pong
export class PongRoom extends Room<PongState> {

    // dimensioni canvas lato client
    // hardcodate qui
    private canvasW: number = 1024;
    private canvasH: number = 768;

    // Configurazione della stanza
    onCreate(options: any) {
        console.log("PongRoom creata!", options);

        // instanziamo la pongState
        this.state = new PongState();

        // instanzio direttamente la pallina
        this.state.ball = new BallSchema(this.canvasH / 2, this.canvasW / 2)
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