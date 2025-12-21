import {BallSchema} from "../../shared/schema/BallSchema";

export class GameFunctions {


    constructor() {
    }

    public ballBounceFunction(ball: BallSchema, canvasW: number, canvasH: number) {

        // se tocco bordo sinistro
        if (ball.y <= 0) {

        }

    }

    public ballMove_x(ballX: number, increment: number) {
        return ballX += increment;
    }

    public ballMove_y(ballY: number, increment: number) {
        return ballY += increment;
    }

    public resetBall(ball: BallSchema, resetPosX: number, resetPosY: number) {
        ball.x = resetPosX;
        ball.y = resetPosY;
    }
}