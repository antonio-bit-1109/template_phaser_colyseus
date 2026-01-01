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
        this.defineDirectionMovementOnXYAxes();
    }

    private defineDirectionMovementOnXYAxes() {

        let directionX = Math.random();
        let directionY = Math.random();

        if (directionX > 0 && directionX <= 0.5) {
            this.vx *= -1;
        }

        if (directionY >= 0.5) {
            this.vy *= -1;
        }
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