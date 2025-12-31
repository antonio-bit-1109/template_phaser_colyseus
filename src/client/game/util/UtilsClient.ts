import {Scene} from "phaser";
import TextStyle = Phaser.GameObjects.TextStyle;

export class UtilsClient {

    private readonly cursors;

    constructor(scene?: Scene) {
        if (scene) {
            this.cursors = scene?.input?.keyboard?.createCursorKeys();

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