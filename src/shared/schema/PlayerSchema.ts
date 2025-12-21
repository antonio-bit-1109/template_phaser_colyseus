import {Schema, type} from "@colyseus/schema";

// schema che definisce l'oggetto giocatore

export class PlayerSchema extends Schema {

    @type("number") y: number;
    @type("number") x: number;

    constructor(initialX: number = 100, initialY: number = 350,) {
        super();
        this.y = initialY;
        this.x = initialX;
    }


}
