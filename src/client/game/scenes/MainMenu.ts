import {Scene} from 'phaser';
import {StyleManager} from "../util/styleManager.ts";

export class MainMenu extends Scene {

    private styleManager: StyleManager;

    constructor() {
        super('MainMenu');
        this.styleManager = new StyleManager();
    }

    create() {

        this.add.text(
            this.game.config.width as number / 2,
            this.game.config.height as number / 3,
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
            this.game.config.width as number / 2,
            this.game.config.height as number / 2,
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
            .setInteractive({cursor: "pointer"}).once('pointerdown', () => {
            this.scene.start("game")
        })

    }
}
