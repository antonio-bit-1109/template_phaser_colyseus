import {Schema, type} from "@colyseus/schema";

export class BallSchema extends Schema {
    @type("number") x: number = 400;
    @type("number") y: number = 300;

    constructor(ballY:number = 500 , ballX:number = 500 , ) {
        super();
        this.x = ballX;
        this.y = ballY;
    }
}