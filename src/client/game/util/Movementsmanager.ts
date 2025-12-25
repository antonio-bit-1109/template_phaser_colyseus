import {Scene} from "phaser";

export class Movementsmanager {

    private readonly cursors;


    constructor(scene: Scene) {
        this.cursors = scene?.input?.keyboard?.createCursorKeys();
    }


    public getCursor() {

        if (this.cursors) {
            return this.cursors
        }
        throw new Error("Il cursore non è definito.")

    }
}