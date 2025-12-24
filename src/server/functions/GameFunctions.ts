import {BallSchema} from "../../shared/schema/BallSchema";

export class GameFunctions {

    private timeoutRef: NodeJS.Timeout | null = null;

    // constructor() {
    // }

    public ballBounceFunction(ball: BallSchema, canvasW: number, canvasH: number) {

        let raggioBall = ball.r;

        // se la palla è ferma esci
        if (ball.vx === 0 && ball.vy === 0) return;

        // sbatte sn
        if (ball.x - raggioBall <= 0) {
            // ball.x = raggioBall;
            // ball.vx *= -1;
            this.resetBall(ball, canvasW / 2, canvasH / 2, raggioBall, ball.y)

            // sbatte dx
        } else if (ball.x + raggioBall >= canvasW) {
            // ball.x = canvasW - raggioBall;
            // ball.vx *= -1;
            this.resetBall(ball, canvasW / 2, canvasH / 2, canvasW - raggioBall, ball.y)

        }


        // sbatte sopra
        if (ball.y - raggioBall <= 0) {
            ball.y = raggioBall;
            ball.vy *= -1;

            // sbatte sotto
        } else if (ball.y + raggioBall >= canvasH) {
            ball.y = canvasH - raggioBall;
            ball.vy *= -1
        }

    }

    public ballMove_x(ball: BallSchema, direction?: number) {
        ball.x += ball.vx;
    }

    public ballMove_y(ball: BallSchema, direction?: number) {
        ball.y += ball.vy;
    }

    public resetBall(
        ball: BallSchema,
        resetPosX: number,
        resetPosY: number,
        xFinalPosition: number,
        yFinalPosition: number
    ) {

        if (this.timeoutRef) {
            clearTimeout(this.timeoutRef)
        }

        ball.x = xFinalPosition;
        ball.y = yFinalPosition;
        ball.vx = 0;
        ball.vy = 0;

        this.timeoutRef = setTimeout(() => {
            const randomvX = Math.floor(Math.random() * 2);
            const randomvY = Math.floor(Math.random() * 2);
            let newvX = randomvX === 0 ? -4 : 4
            let newVy = randomvY === 0 ? -4 : 4
            ball.x = resetPosX;
            ball.y = resetPosY;
            ball.vx = newvX;
            ball.vy = newVy;
        }, 1000)

    }
}