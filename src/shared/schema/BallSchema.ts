import {Schema, defineTypes} from "@colyseus/schema";

export class BallSchema extends Schema {
    x: number = 400;
    y: number = 300;
    vx: number = 8;
    vy: number = 8;
    r: number = 22;
    resetVx = 8;
    resetVy = 8;
    kappa = 1;
    b = 4;
    c = "star";

    constructor(ballX: number = 500, ballY: number = 500) {
        super();
        this.x = ballX;
        this.y = ballY;
    }
}

// @ts-ignore
defineTypes(BallSchema, {
    x: "number",
    y: "number",
    vx: "number",
    vy: "number",
    r: "number",
    resetVx: "number",
    resetVy: "number"
});