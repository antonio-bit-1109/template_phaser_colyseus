import {defineTypes, Schema} from "@colyseus/schema";


// schema che definisce l'oggetto bonus
export class BonusSchema extends Schema {

    y: number;
    x: number;
    r: number = 20;
    vx: number = 12;
    vy: number = 12;
    hitbox_x = 0;
    active: boolean = false;
    type: string = "";

    constructor(initialX: number = 512, initialY: number = 384) {
        super();
        this.y = initialY;
        this.x = initialX;
    }
    
}

// @ts-ignore
defineTypes(BonusSchema, {
    x: "number",
    y: "number",
    r: "number",
    active: "boolean",
    type: "string",
    vx: "number",
    vy: "number",
    hitbox_x: "number"
});