import {defineTypes, Schema} from "@colyseus/schema";


// schema che definisce l'oggetto bonus
export class BulletSchema extends Schema {

    y: number; // pos x
    x: number; // pos y
    r: number = 2.5; // raggio
    vx: number = 16; // veocità sulla x
    vy: number = 0;
    initialX: number = 0;
    initialY: number = 0;
    id: string = ""
    idSessionOwnerPlayer = "";
    invertedVx = false;
    resetVx = 0;
    resetVy = 0;

    //id univoco bullet
    // idSession del player che lo ha generato
    // init posizione x
    // init posizione y
    constructor(id: string, sessionIdPlayer: string, initialX: number, initialY: number,) {
        super();
        this.initialX = initialX;
        this.initialY = initialY;
        this.x = initialX;
        this.y = initialY;
        this.id = id;
        this.idSessionOwnerPlayer = sessionIdPlayer;
        this.checkIfInvertvX()
        this.makeTheBulletSpawnAheadIsOwner()
    }

    private checkIfInvertvX() {
        if (this.initialX > 500) {
            this.vx *= -1;
            this.invertedVx = true;
        }
    }

    // faccio spawnare il bullet leggermente piu avanti rispetto alla coord x del suo owner
    // cosi non triggera una collisione
    // a seconda che si tratti del player di dx o di sn
    // devo aggiungere o sottrarre un valore alla x per farlo essere "davanti" al rispettivo player
    private makeTheBulletSpawnAheadIsOwner() {

        if (this.invertedVx) {
            this.x -= 80;
        } else {
            this.x += 80;
        }

    }
}

// @ts-ignore
defineTypes(BulletSchema, {
    x: "number",
    y: "number",
    r: "number",
    vx: "number",
    vy: "number",
    id: "string",
    initialX: "number",
    initialY: "number",
    idSessionOwnerPlayer: "string",
    invertedVx: "boolean",
    resetVx: "number",
    resetVy: "number"
});