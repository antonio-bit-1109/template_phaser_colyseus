import {Scene} from 'phaser';
import {StyleManager} from "../util/styleManager.ts";
import DOMElement = Phaser.GameObjects.DOMElement;

export class MainMenu extends Scene {

    private readonly styleManager: StyleManager;
    private name: string | null = null;
    private inputDom: DOMElement | null = null;
    private errorMsg: Phaser.GameObjects.Text;
    private canvasW: number;
    private canvasH: number;

    constructor() {
        super('MainMenu');
        this.styleManager = new StyleManager();

    }

    create() {

        this.canvasW = this.game.config.width as number;
        this.canvasH = this.game.config.height as number;

        this.add.text(
            this.canvasW / 2,
            this.canvasH / 3,
            "PONGDUDES",
            this.styleManager.returnBasicConfigurationStyle(
                "black",
                80,
                10,
                2,
                10
            )
        ).setOrigin(0.5, 0.5)

        this.add.text(
            this.canvasW / 2,
            this.canvasH / 2,
            "Start",
            this.styleManager.returnBasicConfigurationStyle(
                "black",
                50,
                6,
                2,
                10
            )
        )
            .setOrigin(0.5, 0.5)
            .setInteractive({cursor: "pointer"}).on('pointerdown', () => {
            if (!this.name) {
                this.errorMsg.setVisible(true)
            } else {

                this.scene.start("game", {
                    name: this.name
                })
            }
        })

        this.errorMsg = this.add.text(
            this.canvasW / 2,
            this.canvasH / 1.1,
            "Inserisci il tuo nome per poter continuare",
            {
                color: "red",
                fontSize: 30,
                strokeThickness: 5,
            }
        ).setOrigin(0.5, 0.5)
            .setVisible(false)


        this.inputDom = this.add.dom(
            this.canvasW / 2,
            this.canvasH / 1.5
        ).createFromHTML(
            `<input type="text" name="nameField" placeholder="Inserisci nome utente"
        style="font-size: 32px; width: 400px; padding: 10px; border-radius: 5px; border: 2px solid #ff0000;">
        `)

        this.inputDom.addListener('input'); // 'input' è meglio di 'keydown' per leggere il testo
        this.inputDom.on('input', (event: any) => {
            // event.target è il vero tag <input> dell'HTML
            const value = event.target.value;

            this.name = value;
            console.log("Nome attuale:", this.name);
        });
    }
}
