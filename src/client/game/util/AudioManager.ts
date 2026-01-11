import {Scene} from "phaser";
import BaseSound = Phaser.Sound.BaseSound;

export class AudioManager {

    private scene: Scene;
    private readonly soundsMap: Map<string, BaseSound> = new Map<string, BaseSound>();
    private static instance: AudioManager | null = null


    public static getInstance(scene: Scene): AudioManager {

        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager(scene)
            return AudioManager.instance
        } else {

            if (AudioManager.instance.scene !== scene) {
                AudioManager.instance.scene = scene
                AudioManager.instance.stopAllSounds()
            }
            return AudioManager.instance
        }
    }

    private constructor(scene: Scene) {
        this.scene = scene
    }

    public addSoundToApplication(key: string, audio: BaseSound) {
        this.soundsMap.set(key, audio);
    }


    public playSound(key: string) {
        const audio = this.getAudio(key)
        if (audio) {
            audio.play()
        } else {
            console.error("L'audio da avviare non risulta essere presente.")
        }
    }

    public stopAllSounds() {
        if (AudioManager.instance?.soundsMap.values()) {
            for (const sound of AudioManager.instance?.soundsMap.values()) {
                if (sound) {
                    sound.stop()
                }
            }
        }

    }

    public stopSound(key: string) {
        const audio = this.getAudio(key)
        if (audio) {
            audio.stop()
        } else {
            console.error("L'audio da interrompere non risulta essere presente.")
        }
    }

    private getAudio(key: string) {
        return this.soundsMap.get(key)
    }
}