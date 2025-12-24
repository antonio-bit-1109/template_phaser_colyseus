import {Scene} from "phaser";

export class Movementsmanager {

    private cursors;


    constructor(scene: Scene) {
        this.cursors = scene.input.keyboard.createCursorKeys();
    }


    public getCursor() {
        return this.cursors;
    }
}