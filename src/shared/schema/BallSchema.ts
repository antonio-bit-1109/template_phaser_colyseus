import {Schema, defineTypes} from "@colyseus/schema";

export class BallSchema extends Schema {
    x: number = 400;
    y: number = 300;
    vx: number = 4;
    vy: number = 4;
    r: number = 22;

    constructor(ballX: number = 500, ballY: number = 500, vx: number = 4, vy: number = 4) {
        super();
        this.x = ballX;
        this.y = ballY;
        this.vx = vx;
        this.vy = vy;
    }
}

// @ts-ignore
defineTypes(BallSchema, {
    x: "number",
    y: "number",
    vx: "number",
    vy: "number",
    r: "number"
});