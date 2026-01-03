import {Schema, defineTypes} from "@colyseus/schema";

export class BallSchema extends Schema {
    x: number = 400;
    y: number = 300;
    vx: number = 10;
    vy: number = 10;
    r: number = 22;

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
    r: "number"
});