import {MapSchema, Schema, type} from "@colyseus/schema";
import {BallSchema} from "../schema/BallSchema.ts";
import {PlayerSchema} from "../schema/PlayerSchema.ts";

// contenitore di tutti gli schema definiti per il gioco pong
export class PongState extends Schema{

    // generica stringa
    @type("string") gameState: string = "waiting...";
    // istanza di ball (singola ball)
    @type(BallSchema) ball = new BallSchema();
    // istanza di player mappato dentro una mappa (contenitore di piu oggetti player)
    @type({ map: PlayerSchema }) players = new MapSchema<PlayerSchema>();


}