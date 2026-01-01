import {defineTypes, Schema} from "@colyseus/schema";

// schema che definisce l'oggetto giocatore

export class PlayerSchema extends Schema {

    y: number;
    x: number;
    vx: number = 4;
    vy: number = 4;
    r: number = 30;
    playerName = "";
    playerPoints = 0;
    colorName = "";
    index = 999;
    isGrowUp = false

    constructor(index: number, initialX: number = 100, initialY: number = 350) {
        super();
        this.y = initialY;
        this.x = initialX;
        this.index = index;
    }


}

// @ts-ignore
defineTypes(PlayerSchema, {
    x: "number",
    y: "number",
    r: "number",
    playerName: "string",
    playerPoints: "number",
    colorName: "string",
    index: "number"
});