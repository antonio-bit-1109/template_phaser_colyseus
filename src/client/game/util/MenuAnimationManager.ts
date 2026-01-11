import {Scene} from "phaser";
import Image = Phaser.GameObjects.Image;

export class MenuAnimationManager {

    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene
    }

    public moveMezzoBustoStraigth(mezzobusto: Image, canvasW: number, canvasH: number) {


        this.scene.tweens.chain({
            targets: mezzobusto,
            loop: -1,
            tweens: [
                {
                    duration: 1500,
                    y: canvasH - 100
                },
                {
                    duration: 1500,
                    y: canvasH + 100
                },
                {
                    x: canvasW / 2
                },
                {
                    duration: 1500,
                    y: canvasH - 100
                },
                {
                    duration: 1500,
                    y: canvasH + 100
                },
                {
                    x: canvasW - 100
                },
                {
                    duration: 1500,
                    y: canvasH - 100
                },
                {
                    y: canvasH + 100
                },
                {
                    duration: 5000,
                    x: canvasW / 2,
                    y: canvasH - 100
                },
                {
                    duration: 5000,
                    x: 100,
                    y: canvasH + 100
                }
            ]
        })
    }

    public moveMezzoBusto(mezzobusto: Image) {

        this.scene.tweens.chain({
            targets: mezzobusto,
            loop: -1,
            tweens: [
                {
                    angle: 90,
                    duration: 1000,
                    ease: 'Linear',
                    x: mezzobusto.x + 250,
                },
                {

                    duration: 1000,
                    ease: 'Linear',
                    x: mezzobusto.x - 200,
                },
                {

                    duration: 1000,
                    ease: 'Linear',
                    y: mezzobusto.y + 230,
                    angle: 0
                },
                {

                    duration: 1000,
                    ease: 'Linear',
                    x: mezzobusto.x - 600,

                },
                {

                    duration: 2000,
                    ease: 'Linear',
                    x: mezzobusto.x + 250,

                },
                {

                    duration: 1000,
                    ease: 'Linear',
                    x: mezzobusto.x - 250,

                },
                {
                    angle: -90,
                    y: mezzobusto.y
                },
                {
                    duration: 1000,
                    x: 100
                },
                {
                    duration: 3000,
                    x: 200
                },
                {
                    duration: 1000,
                    x: 400
                },
                {
                    duration: 10,
                    angle: 90
                }
            ]
        });

    }
}