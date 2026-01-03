import {Scene} from "phaser";
import TextStyle = Phaser.GameObjects.TextStyle;
import {PlayerSchema} from "../../../shared/schema/PlayerSchema.ts";
import Rectangle = Phaser.GameObjects.Rectangle;


export class UtilsClient {

    private readonly cursors;
    private readonly scene: Scene;
    private readonly mapLowerHpBars: Map<string, Rectangle> = new Map<string, Rectangle>();
    private readonly mapUpperHpBar: Map<string, Rectangle> = new Map<string, Rectangle>();


    constructor(scene?: Scene) {
        if (scene) {
            this.scene = scene;
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


    public createLowerHpBar(player: PlayerSchema, sessionId: string) {
        if (!this.mapLowerHpBars.get(sessionId)) {
            this.mapLowerHpBars.set(sessionId, this.createBar(0xff0000, player))
        }
    }

    public createUpperHpBar(player: PlayerSchema, sessionId: string) {
        if (!this.mapUpperHpBar.get(sessionId)) {
            this.mapUpperHpBar.set(sessionId, this.createBar(0x008000, player))

        }
    }

    public updateLowerPositionBar(player: PlayerSchema, sessionId: string) {
        if (!this.mapLowerHpBars.get(sessionId)) return;

        const lowerBar = this.mapLowerHpBars.get(sessionId)
        if (lowerBar) {
            lowerBar.setPosition(
                player.x + 10,
                player.y - 60
            )
        }
    }

    public updateUpperPositionBar(player: PlayerSchema, sessionId: string) {
        if (!this.mapUpperHpBar.get(sessionId)) return;

        const upperBar = this.mapUpperHpBar.get(sessionId)
        if (upperBar) {
            upperBar.setPosition(
                player.x + 10,
                player.y - 60
            ).setDepth(2)
        }
    }

    private createBar(color: number, player: PlayerSchema) {
        return this.scene.add.rectangle(
            player.x + 10,
            player.y - 60,
            player.hp,
            10,
            color
        )
    }
}