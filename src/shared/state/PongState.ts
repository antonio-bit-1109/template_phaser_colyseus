import {defineTypes, MapSchema, Schema} from "@colyseus/schema";
import {BallSchema} from "../schema/BallSchema";
import {PlayerSchema} from "../schema/PlayerSchema";


// contenitore di tutti gli schema definiti per il gioco pong
export class PongState extends Schema {

    // generica stringa
    gameState: string = "waiting...";
    // istanza di ball (singola ball)
    ball = new BallSchema();
    // istanza di player mappato dentro una mappa (contenitore di piu oggetti player)
    players = new MapSchema<PlayerSchema>();
    
}

defineTypes(PongState, {
    ball: BallSchema,
    players: {map: PlayerSchema},
    gameState: "string"
});