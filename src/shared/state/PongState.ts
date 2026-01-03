import {defineTypes, MapSchema, Schema} from "@colyseus/schema";
import {BallSchema} from "../schema/BallSchema";
import {PlayerSchema} from "../schema/PlayerSchema";
import {BonusSchema} from "../schema/BonusSchema.ts";
import {BulletSchema} from "../schema/BulletSchema.ts";


// contenitore di tutti gli schema definiti per il gioco pong
export class PongState extends Schema {

    // generica stringa
    gameState: string = "waiting...";
    // istanza di ball (singola ball)
    ball = new BallSchema();
    // istanza di player mappato dentro una mappa (contenitore di piu oggetti player)
    players = new MapSchema<PlayerSchema>();

    bullets = new MapSchema<BulletSchema>();

    bonus: BonusSchema = new BonusSchema();
}

defineTypes(PongState, {
    ball: BallSchema,
    players: {map: PlayerSchema},
    gameState: "string",
    bonus: BonusSchema || null,
    bullets: {map: BulletSchema}
});