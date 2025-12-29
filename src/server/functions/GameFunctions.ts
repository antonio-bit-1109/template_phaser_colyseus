import {BallSchema} from "../../shared/schema/BallSchema";
import {PlayerSchema} from "../../shared/schema/PlayerSchema.ts";
import {PongState} from "../../shared/state/PongState.ts";
import {Schema} from "@colyseus/schema";
import {BonusSchema} from "../../shared/schema/BonusSchema.ts";


export class GameFunctions {

    private timeoutRef: NodeJS.Timeout | null = null;
    private readonly state: PongState;

    constructor(state: PongState) {
        this.state = state;
    }


    public objectBounceFunction(
        ball: Schema<any>,
        canvasW: number,
        canvasH: number,
        deltaRimbalzo: number,
        isBall: boolean
    ) {

        let object: BallSchema | BonusSchema;

        if (ball instanceof BallSchema) {
            object = ball as BallSchema
        } else {
            object = ball as BonusSchema
        }

        let raggioBall = object.r;

        // se la palla è ferma esci
        if (object.vx === 0 && object.vy === 0) return;

        // sbatte sn
        if (object.x - raggioBall <= 0) {


            // se oggetto che rimbalza è la palla applico logica della palla
            // resetto la palla quando tocca uno dei muri di punto
            // aumento punteggio giocatore avversario
            if (isBall) {
                this.resetBall(object, canvasW / 2, canvasH / 2, raggioBall, object.y)
                // quando la palla sbatte sul muro di sinistra,
                // assegno +1 al giocatore opposto, quello con index = 2
                this.state.players.forEach(player => {
                    if (player.index === 2) {
                        player.playerPoints += 1
                    }
                })
            } else {

                // se l'oggetto non è una palla continua a rimbalzare
                object.x = raggioBall;
                object.vx *= deltaRimbalzo;
            }


            // sbatte dx
        } else if (object.x + raggioBall >= canvasW) {

            if (isBall) {
                this.resetBall(object, canvasW / 2, canvasH / 2, canvasW - raggioBall, object.y)
                // quando la palla sbatte sul muro di destra, do punto al giocatore opposto, il primo giocatore creato,
                // cioè quello con index = 1
                this.state.players.forEach(player => {
                    if (player.index === 1) {
                        player.playerPoints += 1
                    }
                })
            } else {
                object.x = canvasW - raggioBall;
                object.vx *= deltaRimbalzo;
            }

        }


        // sbatte sopra
        if (object.y - raggioBall <= 0) {
            object.y = raggioBall;
            object.vy *= deltaRimbalzo;

            // sbatte sotto
        } else if (object.y + raggioBall >= canvasH) {
            object.y = canvasH - raggioBall;
            object.vy *= deltaRimbalzo
        }

    }

    public objectMove_x(ball: Schema<any>) {
        if (ball instanceof BallSchema || ball instanceof BonusSchema) {
            ball.x += ball.vx;
        }
    }

    public objectMove_y(ball: Schema) {
        if (ball instanceof BallSchema || ball instanceof BonusSchema) {
            ball.y += ball.vy;
        }

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
            ball.y - ball.r <= player.y + player.r

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