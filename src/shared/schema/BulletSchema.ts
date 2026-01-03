import {defineTypes, Schema} from "@colyseus/schema";


// schema che definisce l'oggetto bonus
export class BulletSchema extends Schema {

    y: number;
    x: number;
    r: number = 5;
    vx: number = 16;
    vy: number = 16;


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