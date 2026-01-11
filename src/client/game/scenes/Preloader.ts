import {Scene} from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        // this.add.image(512, 384, 'background');
        //
        // //  A simple progress bar. This is the outline of the bar.
        // this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
        //
        // //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        // const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);
        //
        // //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        // this.load.on('progress', (progress: number) => {
        //
        //     //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
        //     bar.width = 4 + (460 * progress);
        //
        // });
    }

    preload() {
        // carico il path a partire dalla cartella public
        this.load.setPath('public');

        this.load.image("sfondo", "/assets/sfondo.png")
        this.load.image("ball", "/assets/pingpongBall.png")
        this.load.image("player1", "/assets/dude_ping_pong.png")
        this.load.image("player2", "/assets/boss_ping_pong.png")
        this.load.image("bonusGrowUp", "/assets/Bonus_1_1.png")
        this.load.image("malusSlowed", "/assets/Bonus_2_1.png")
        this.load.image("bullet", "/assets/bullet_03.png")
        this.load.image("canvasMenu", "/assets/canvasMenu.png")
        this.load.image("mezzobustoDude", "/assets/mezzoBustoDude.png")
        this.load.image("mezzobustoBoss", "/assets/boss_silly.png")

        // caricamento suoni-audio
        this.load.audio("bg_music", "/sounds/bg_music.mp3")
        this.load.audio("gameplayMusic", "/sounds/bg_groove.mp3")
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
