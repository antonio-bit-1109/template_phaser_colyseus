import { Scene } from 'phaser';
import * as Colyseus from "colyseus.js"; // <--- IMPORTANTE

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;

    client: Colyseus.Client;

    constructor ()
    {
        super('Game');
    }

    async create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.msg_text = this.add.text(512, 384, 'Connessione al server...', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });
        this.msg_text.setOrigin(0.5);

        // --- LOGICA DI CONNESSIONE ---
        // Istanziamo il client collegandolo a localhost:2567
        this.client = new Colyseus.Client("ws://localhost:2567");

        try {
            // Tentiamo di entrare o creare la stanza 'my_room' definita nel server
            const room = await this.client.joinOrCreate("my_room");

            console.log("Connesso con successo!", room);
            this.msg_text.setText("Connesso al Server!\nSession ID: " + room.sessionId);

        } catch (e) {
            console.error("ERRORE CONNESSIONE:", e);
            this.msg_text.setText("Errore di connessione :(");
        }
        // -----------------------------

        this.input.once('pointerdown', () => {
            this.scene.start('GameOver');
        });
    }
}
