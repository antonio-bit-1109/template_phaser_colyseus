import {BonusSchema} from "../../../shared/schema/BonusSchema.ts";
import Sprite = Phaser.GameObjects.Sprite;
import {IMessage} from "../../../shared/interface/IMessage.ts";
import * as Colyseus from "colyseus.js";
import {Scene} from "phaser";
import TextStyle = Phaser.GameObjects.TextStyle;
import {PlayerSchema} from "../../../shared/schema/PlayerSchema.ts";

export class UtilsClient {

    private readonly cursors;

    // private timeout;

    constructor(scene?: Scene) {
        if (scene) {
            this.cursors = scene?.input?.keyboard?.createCursorKeys();

        }
    }

    public checkBonusAndModifySprite(bonus: BonusSchema, player: Sprite, room: Colyseus.Room, playerSchema: PlayerSchema) {

        // se bonus è un growup aumento dimensioni dello sprite e aumento raggio del playerschema
        // setscale = 0.3 --- r= 30;
        // setscale = 0.5 --- r = 45;
        if (bonus.type.toLowerCase() === "growup") {

            // controllo se l ultimo hitbox del bonus è a destra o sinistra dello schermo,
            // questo mi dice quale player è stato colpito
            // e quindi a quale player applicare il bonus
            if (bonus.hitbox_x < 500 && playerSchema.index === 1) {
                player.setScale(0.5)
                const message: IMessage = {
                    player_r: 45
                }
                room.send("change_r_player", message)
            }

            if (bonus.hitbox_x > 500 && playerSchema.index === 2) {
                player.setScale(0.5)
                const message: IMessage = {
                    player_r: 45
                }
                room.send("change_r_player", message)
            }

            // notifica al server per far tornare il player alla dimensione originale

            // timeout per far tornare il player a dimensione originale
            // this.timeout = setTimeout(() => {
            //     let scale = player.scale
            //     if (scale > 0.3) {
            //         // player.setScale(0.3)
            //         const message: IMessage = {
            //             player_r: 30
            //         }
            //         room.send("change_r_player", message)
            //     }
            // }, 5000)
        }
    }

    public returnBasicConfigurationStyle(
        color?: string,
        fontsize?: number,
        strokeThickness?: number,
        letterSpacing?: number,
        stroke?: number
    ) {
        return {
            color: color ? color : "black",
            fontSize: fontsize ? fontsize : 40,
            strokeThickness: strokeThickness ? strokeThickness : 5,
            letterSpacing: letterSpacing ? letterSpacing : 2,
            stroke: stroke ? stroke : 10
        } as unknown as TextStyle
    }

    public setDisplayPoints(playerIndex: number, canvasW: number) {
        return playerIndex === 1 ? canvasW / 3 : canvasW / 1.7
    }


    // client method
    public getCursor() {

        if (this.cursors) {
            return this.cursors
        }
        throw new Error("Il cursore non è definito.")

    }

}