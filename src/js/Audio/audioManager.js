// src/audioManager.js

import { Resources } from '../Recources/resources.js';

export class AudioManager {
    constructor() {
        this.backgroundMusic = Resources.Muziek;
        this.gameOverMusic = Resources.GameOverMusic;

        this.backgroundMusic.loop = true;
    }

    playMusic(type) {
        if (type === 'background') {
            if (this.gameOverMusic.isPlaying()) {
                this.gameOverMusic.stop();
            }
            if (!this.backgroundMusic.isPlaying()) {
                this.backgroundMusic.play();
            }
        } else if (type === 'gameover') {
            if (this.backgroundMusic.isPlaying()) {
                this.backgroundMusic.stop();
            }
            this.gameOverMusic.play();
        }
    }

   
}