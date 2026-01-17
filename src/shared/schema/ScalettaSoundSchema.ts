import {Schema, defineTypes} from "@colyseus/schema";

export class ScalettaSoundSchema extends Schema {

    statusRoom = "";
    golEvent = false;

    constructor() {
        super();
    }
}

// @ts-ignore
defineTypes(ScalettaSoundSchema, {
    statusRoom: "string",
    golEvent: "boolean"
});