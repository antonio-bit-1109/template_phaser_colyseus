import {Scene} from 'phaser';
import DOMElement = Phaser.GameObjects.DOMElement;
import {UtilsClient} from "../util/UtilsClient.ts";
import Image = Phaser.GameObjects.Image;
import {MenuAnimationManager} from "../util/MenuAnimationManager.ts";
import {AudioManager} from "../util/AudioManager.ts";

export class MainMenu extends Scene {

    private utilsClient: UtilsClient
    private menuAnimationManager: MenuAnimationManager;
    private audioManager: AudioManager;
    private name: string | null = null;
    private inputDom: DOMElement | null = null;
    private errorMsg: Phaser.GameObjects.Text;
    private canvasW: number;
    private canvasH: number;
    private menu: Image;
    private mezzobustoBoss: Image;
    private mezzobustoDude: Image;

    constructor() {
        super('MainMenu');
    }

    create() {
        this.utilsClient = new UtilsClient(this);
        this.menuAnimationManager = new MenuAnimationManager(this)
        this.canvasW = this.game.config.width as number;
        this.canvasH = this.game.config.height as number;


        this.audioManager = AudioManager.getInstance(this)
        this.audioManager.addSoundToApplication("menuMusic", this.sound.add("bg_music", {loop: true, volume: 1}))
        this.audioManager.playSound("menuMusic");


        this.menu = this.add.image(
            this.canvasW / 2,
            this.canvasH / 2,
            "canvasMenu"
        ).setScale(1.4, 1.2)
            .setDepth(5)

        this.mezzobustoDude = this.physics.add.image(
            this.menu.x + this.menu.displayWidth / 4,
            this.canvasH / 3,
            "mezzobustoDude")
            .setDepth(4)
            .setScale(0.5)
            .setOrigin(0.5, 0.5)
            .setRotation(Phaser.Math.DegToRad(90))

        this.mezzobustoBoss = this.physics.add.image(
            100,
            this.canvasH + 100,
            "mezzobustoBoss")
            .setDepth(10)
            .setScale(0.5)
            .setOrigin(0.5, 0.5)

        this.menuAnimationManager.moveMezzoBusto(this.mezzobustoDude)
        this.menuAnimationManager.moveMezzoBustoStraigth(this.mezzobustoBoss, this.canvasW, this.canvasH)


        this.add.text(
            this.canvasW / 2,
            this.canvasH / 3,
            "PONGDUDES",
            this.utilsClient.returnBasicConfigurationStyle(
                "black",
                80,
                10,
                2,
                10
            )
        ).setOrigin(0.5, 0.5)
            .setDepth(5)

        this.add.text(
            this.canvasW / 2,
            this.canvasH / 2,
            "Start",
            this.utilsClient.returnBasicConfigurationStyle(
                "black",
                50,
                6,
                2,
                10
            )
        )
            .setOrigin(0.5, 0.5)
            .setDepth(5)
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
