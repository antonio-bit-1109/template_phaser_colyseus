import {Scene} from "phaser";
import BaseSound = Phaser.Sound.BaseSound;

export class AudioManager {

    private scene: Scene;
    private static soundsMap: Map<string, BaseSound> = new Map<string, Phaser.Sound.BaseSound>();

    constructor(scene: Scene) {
        this.scene = scene
    }


    public addSoundToCommonMap(key: string, sound: BaseSound) {
        if (key && sound) {
            AudioManager.soundsMap.set(key, sound);
        }
        if (!key) {
            console.error("Chiave mappa non fornita.")
        }
        if (!sound) {
            console.error("Oggetto suono non fornito.")
        }
    }


    public playSound(key: string) {
        if (!key) {
            console.error("Chiave di riproduzione del suono non fornita!")
        }
        const audio = AudioManager.soundsMap.get(key);
        if (audio) {
            audio.play();
        } else {
            console.info("chiave non prsente nella mappa dei suoni.")
        }
    }

    public stopSound(key: string) {
        const audio = AudioManager.soundsMap.get(key);
        if (audio) {
            audio.stop();
        }
    }

    public stopAllSounds() {
        const sounds = AudioManager.soundsMap.values();

        if (sounds) {
            for (const sound of sounds) {
                sound.stop()
            }
        } else {
            console.info("nessun audio presente in mappa da interrompere")
        }

    }
    
}