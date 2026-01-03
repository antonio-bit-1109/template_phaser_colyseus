import {defineTypes, Schema} from "@colyseus/schema";


// schema che definisce l'oggetto bonus
export class BulletSchema extends Schema {

    y: number; // pos x
    x: number; // pos y
    r: number = 2.5; // raggio
    vx: number = 16; // veocità sulla x
    vy: number = 16; // vel sulla y

    constructor(x = -1000, y = -2000) {
        super();
        this.x = x;
        this.y = y;
    }

}

// @ts-ignore
defineTypes(BulletSchema, {
    x: "number",
    y: "number",
    r: "number",
    vx: "number",
    vy: "number"
});