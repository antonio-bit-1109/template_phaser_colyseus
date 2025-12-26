import {BallSchema} from "../../shared/schema/BallSchema";
import {PlayerSchema} from "../../shared/schema/PlayerSchema.ts";

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

    public ballMove_x(ball: BallSchema) {
        ball.x += ball.vx;
    }

    public ballMove_y(ball: BallSchema) {
        ball.y += ball.vy;
    }

    public checkCollisionWithPlayer(ball: BallSchema, player: PlayerSchema) {

        const raggioPalla = ball.r;
        const raggioPlayer = player.r;


        // logica applicativa sul player a sinistra x = 50
        if (player.x < 500) {
            // controllo se la x e la y della palla si trovano "dentro" le coordinate x e y del player 1
            if (ball.x - raggioPalla <= player.x + raggioPlayer &&
                this.checkCollisionOnYAxe(ball, player)
            ) {
                ball.x = player.x + raggioPlayer + 20
                ball.vx *= -1
            }

        }

        // logica applicativa player a destra x = 950;
        if (player.x > 500)
            // se la palla sta viaggiando verso la meta dx del campo
            // controllo se ce collisione con il player 2

            if (ball.x + raggioPalla >= player.x - raggioPlayer &&
                this.checkCollisionOnYAxe(ball, player)
            ) {
                ball.x = player.x - raggioPlayer - 20
                ball.vx *= -1
            }


    }

    private checkCollisionOnYAxe(ball: BallSchema, player: PlayerSchema) {
        // check collisione con parte superiore del dude
        return ball.y + ball.r >= player.y - player.r &&
            ball.y - ball.r <= player.y + player.r;

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