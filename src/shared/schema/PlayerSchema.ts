import {defineTypes, Schema} from "@colyseus/schema";

// schema che definisce l'oggetto giocatore

export class PlayerSchema extends Schema {

    y: number;
    x: number;
    r: number = 40;
    playerName = "";
    playerPoints = 0;

    constructor(initialX: number = 100, initialY: number = 350,) {
        super();
        this.y = initialY;
        this.x = initialX;
    }


}

// @ts-ignore
defineTypes(PlayerSchema, {
    x: "number",
    y: "number",
    r: "number",
    playerName: "string",
    playerPoints: "number"
});