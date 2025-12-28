import {Scene} from "phaser";

export class Movementsmanager {

    private readonly cursors;


    constructor(scene?: Scene) {
        if (scene) {
            this.cursors = scene?.input?.keyboard?.createCursorKeys();

        }
    }

    // client method
    public getCursor() {

        if (this.cursors) {
            return this.cursors
        }
        throw new Error("Il cursore non è definito.")

    }

    // server method
    public addAccelerationToPlayerMovement(incrementMovement: number) {
        return incrementMovement * 2
    }
}