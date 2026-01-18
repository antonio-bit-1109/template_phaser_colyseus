import {Schema, defineTypes} from "@colyseus/schema";

/**
 * gestione delle musiche iniziali ( musica di attesa secondo giocatore e musica principale)
 * ed evento di gol effettuato
 */
export class ScalettaSoundSchema extends Schema {

    statusRoom = "";
    golEvent = false;

    constructor() {
        super();
    }


    public setGolEvent(bool: boolean) {
        this.golEvent = bool;
    }
}

// @ts-ignore
defineTypes(ScalettaSoundSchema, {
    statusRoom: "string",
    golEvent: "boolean"
});