import { Room, Client } from "colyseus";

export class MyRoom extends Room {
    // Configurazione della stanza
    onCreate (options: any) {
        console.log("MyRoom creata!", options);

        // Qui imposti lo stato iniziale del gioco (lo faremo dopo)
        // this.setState(new MyRoomState());

        this.onMessage("type", (client, message) => {
            // Gestisci i messaggi dal client
        });
    }

    // Quando un giocatore entra
    onJoin (client: Client, options: any) {
        console.log(client.sessionId, "è entrato!");
    }

    // Quando un giocatore esce
    onLeave (client: Client, consented: boolean) {
        console.log(client.sessionId, "è uscito!");
    }

    // Quando la stanza viene chiusa
    onDispose() {
        console.log("room disposed");
    }
}